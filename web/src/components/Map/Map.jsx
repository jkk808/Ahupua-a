import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import {
  MapContainer,
  TileLayer,
  Popup,
  LayersControl,
  Marker,
  LayerGroup,
  FeatureGroup,
  GeoJSON,
  CircleMarker,
} from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import './Map.css'
import ahupuaaData from './data/Ahupuaa.json'
import zonesData from './data/Projects.json'
import ResetViewControl from '../ResetViewControl/ResetViewControl'
import { set } from '@redwoodjs/forms'

// Import marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a custom icon for sensors
const sensorIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Info = ({ position, selected, selectedProject }) => {
  // NOTE: This is a hardcoded value for the number of sensors
  const numSenors = selected ? selected.length : 0
  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }

  console.log('selected', selected)

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">
        <div className="info">
          <h4>Ahupuaa Summary</h4>
          <div className="info-content">
            {selected ? (
              <div>
                <p>Name: {selected}</p>
                <p>Number of Sensor: {numSenors}</p>
              </div>
            ) : (
              <h3>Click on an Ahupuaa to show more information</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Map = () => {
  const mapRef = useRef(null)
  const geoJSONRef = useRef(null)
  // Rename to avoid conflict with JavaScript Map constructor
  const disabledLayersMapRef = useRef(new window.Map());

  // Define initial state object
  const initialState = {
    selected: null,
    selectedProject: null,
    activeLayer: 'ahupuaa',
    zoom: 10.5,
    center: [21.4389, -158]
  };

  const [selected, setSelected] = useState(null);
  const [lastSelectedAhupuaa, setLastSelectedAhupuaa] = useState(null);
  const [selectedProject, setSelectedProject] = useState(initialState.selectedProject);
  const [isZooming, setIsZooming] = useState(false);
  const [activeLayer, setActiveLayer] = useState(initialState.activeLayer);
  const center = initialState.center;
  const zoom = initialState.zoom;
  // Add click timer ref
  const clickTimerRef = useRef(null);
  const DOUBLE_CLICK_DELAY = 300; // ms

  // Function to reset to initial state
  const resetToInitialState = useCallback(() => {
    console.log('RESET: Resetting to initial state');

    // Clear selections
    setSelected(null);
    setLastSelectedAhupuaa(null);
    setSelectedProject(null);
    setIsZooming(false);
    setActiveLayer('ahupuaa');

    // Re-enable all ahupuaa layers through the GeoJSON ref
    if (geoJSONRef.current) {
      console.log('RESET: Re-enabling all ahupuaa polygons');
      geoJSONRef.current.eachLayer((layer) => {
        const featureName = layer.feature?.properties?.ahupuaa;
        console.log('RESET: Re-enabling ahupuaa layer:', {
          name: featureName,
          action: 'enabling all interactions'
        });

        // Re-enable all layers since we're resetting to initial state
        layer.setStyle({
          interactive: true,
          pointerEvents: 'auto'
        });
        if (layer._path) {
          layer._path.classList.remove('pointer-events-none');
        }

        // Re-attach click handler
        layer.off(); // Clear existing handlers
        layer.on({
          click: (e) => handleAhupuaaClick(layer.feature, layer, e)
        });
      });
    }

    // Clear any pending click timers
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    // Clear the disabled layers tracking
    disabledLayersMapRef.current.clear();
    console.log('RESET: Complete - restored to initial state:', {
      selected: null,
      selectedProject: null,
      activeLayer: 'ahupuaa',
      isZooming: false,
      disabledCount: disabledLayersMapRef.current.size
    });

    // Reset map view to initial state
    if (mapRef.current) {
      mapRef.current.setView(initialState.center, initialState.zoom);
    }
  }, []);

  // Create custom panes when the map is ready
  const onMapLoad = (map) => {
    if (!map.getPane('projectsPane')) {
      map.createPane('projectsPane');
      map.getPane('projectsPane').style.zIndex = 650;
    }
    if (!map.getPane('ahupuaaPane')) {
      map.createPane('ahupuaaPane');
      map.getPane('ahupuaaPane').style.zIndex = 400;
    }
    if (!map.getPane('plotsPane')) {
      map.createPane('plotsPane');
      map.getPane('plotsPane').style.zIndex = 700;
    }
    if (!map.getPane('sensorsPane')) {
      map.createPane('sensorsPane');
      map.getPane('sensorsPane').style.zIndex = 750; // Above plots
    }
  }

  // Convert projects to GeoJSON format for rendering
  const projectsGeoJSON = useMemo(() => {
    if (!selected || activeLayer !== 'projects') {
      return { type: "FeatureCollection", features: [] };
    }

    const selectedAhupuaa = zonesData.ahupuaas.find(a => a.name === selected);
    if (!selectedAhupuaa) {
      console.log('No matching ahupuaa found for:', selected);
      return { type: "FeatureCollection", features: [] };
    }

    const features = selectedAhupuaa.projects
      .filter(project => project.polygon && project.polygon.geometry)
      .map(project => ({
        ...project.polygon,
        properties: {
          ...project.polygon.properties,
          id: project.id,
          name: project.name,
          zoom: project.zoom,
          ahupuaa: selectedAhupuaa.name
        }
      }));

    console.log('Generated project features:', features);

    return {
      type: "FeatureCollection",
      features
    };
  }, [selected, activeLayer]);

  // Get all plots from projects
  const plotsGeoJSON = useMemo(() => {
    if (!selectedProject) {
      console.log('No project selected, no plots to show');
      return { type: "FeatureCollection", features: [] };
    }

    const selectedAhupuaa = zonesData.ahupuaas.find(a => a.name === selected);
    if (!selectedAhupuaa) {
      console.log('No matching ahupuaa found for plots:', selected);
      return { type: "FeatureCollection", features: [] };
    }

    const selectedProj = selectedAhupuaa.projects.find(p => p.name === selectedProject);
    if (!selectedProj) {
      console.log('No matching project found for plots:', selectedProject);
      return { type: "FeatureCollection", features: [] };
    }

    const features = (selectedProj.plots || [])
      .filter(plot => plot.polygon && plot.polygon.geometry)
      .map(plot => ({
        type: "Feature",
        geometry: plot.polygon.geometry,
        properties: {
          id: plot.id,
          name: plot.name,
          projectId: selectedProj.id,
          projectName: selectedProj.name
        }
      }));

    console.log('Generated plot features:', {
      projectName: selectedProject,
      plotCount: features.length,
      features
    });

    return {
      type: "FeatureCollection",
      features
    };
  }, [selected, selectedProject]);

  // Get all sensors
  const sensors = useMemo(() => {
    console.log('DEBUG: Building sensor data:', {
      selected,
      selectedProject,
      activeLayer
    });

    if (!selected) {
      console.log('DEBUG: No ahupuaa selected, no sensors to show');
      return [];
    }

    const selectedAhupuaa = zonesData.ahupuaas.find(a => a.name === selected);
    if (!selectedAhupuaa) {
      console.log('DEBUG: No matching ahupuaa found for sensors');
      return [];
    }

    const allSensors = selectedAhupuaa.projects.flatMap(project => {
      // Get project-level sensors
      const projectSensors = (project.sensors || []).map(sensor => ({
        ...sensor,
        projectId: project.id,
        projectName: project.name,
        ahupuaaName: selectedAhupuaa.name
      }));

      // Get plot-level sensors
      const plotSensors = (project.plots || []).flatMap(plot =>
        (plot.sensors || []).map(sensor => ({
          ...sensor,
          projectId: project.id,
          projectName: project.name,
          plotId: plot.id,
          plotName: plot.name,
          ahupuaaName: selectedAhupuaa.name
        }))
      );

      const combinedSensors = [...projectSensors, ...plotSensors];
      console.log('DEBUG: Project sensors:', {
        projectName: project.name,
        projectSensorCount: projectSensors.length,
        plotSensorCount: plotSensors.length,
        totalSensors: combinedSensors.length
      });

      return combinedSensors;
    });

    console.log('DEBUG: Total sensors found:', {
      ahupuaa: selectedAhupuaa.name,
      count: allSensors.length,
      sensors: allSensors
    });

    return allSensors;
  }, [selected, selectedProject]);

  // Debug effect to log state changes - moved after all useMemo definitions
  useEffect(() => {
    console.log('Layer state changed:', {
      activeLayer,
      selected,
      selectedProject,
      projectsAvailable: projectsGeoJSON.features.length,
      plotsAvailable: plotsGeoJSON.features.length,
      sensorsAvailable: sensors.length,
      isZooming
    });

    // Debug check for unexpected state combinations
    if (activeLayer === 'plots' && !selectedProject) {
      console.warn('Warning: In plots layer but no project selected');
    }
    if (activeLayer === 'projects' && !selected) {
      console.warn('Warning: In projects layer but no ahupuaa selected');
    }
  }, [activeLayer, selected, selectedProject, projectsGeoJSON, plotsGeoJSON, sensors, isZooming]);

  // Effect to handle layer transitions
  useEffect(() => {
    console.log('Layer transition check:', {
      activeLayer,
      isZooming,
      selected,
      selectedProject
    });
  }, [activeLayer, isZooming]);

  const handleAhupuaaClick = useCallback((feature, layer, e) => {
    const ahupuaaName = feature.properties.ahupuaa;
    console.log('HANDLER: Processing ahupuaa click:', {
      name: ahupuaaName,
      currentSelected: selected,
      lastSelected: lastSelectedAhupuaa
    });

    // Block if we're zooming
    if (isZooming) {
      console.log('BLOCKED: Ahupuaa interaction blocked:', {
        name: ahupuaaName,
        reason: 'zooming in progress'
      });
      return;
    }

    // Reset state if selecting a different ahupuaa
    if (selected && selected !== ahupuaaName) {
      console.log('STATE: Resetting state for new ahupuaa:', {
        from: selected,
        to: ahupuaaName,
        lastSelected: lastSelectedAhupuaa
      });
      resetToInitialState();
    }

    // Update selections
    setLastSelectedAhupuaa(selected || ahupuaaName); // Track the previous selection
    setSelected(ahupuaaName);

    // Clear project selection and reset layer state
    if (selectedProject) {
      console.log('STATE: Clearing project selection:', {
        from: selectedProject,
        to: null,
        reason: 'new ahupuaa selection'
      });
      setSelectedProject(null);
      setActiveLayer('ahupuaa');
    }

    const ahupuaaData = zonesData.ahupuaas.find(a => a.name === ahupuaaName);
    const hasProjects = ahupuaaData && ahupuaaData.projects?.length > 0;

    console.log('DATA: Ahupuaa properties:', {
      name: ahupuaaName,
      hasProjects,
      projectCount: ahupuaaData?.projects?.length || 0
    });

    const map = mapRef.current;
    if (map) {
      setIsZooming(true);
      console.log('STATE: Setting zoom state:', {
        from: false,
        to: true,
        reason: 'ahupuaa click'
      });

      // Get center of the ahupuaa polygon
      const center = layer.getBounds().getCenter();
      console.log('ZOOM: Ahupuaa zoom initiated:', {
        name: ahupuaaName,
        center,
        hasProjects
      });

      // Zoom to the ahupuaa center
      map.setView(center, 14);

      // Switch to projects layer if the ahupuaa has projects
      setTimeout(() => {
        if (hasProjects) {
          console.log('ZOOM: Ahupuaa zoom complete, transitioning to projects:', {
            ahupuaa: ahupuaaName,
            nextLayer: 'projects'
          });
          setActiveLayer('projects');
        } else {
          console.log('ZOOM: Ahupuaa zoom complete, staying in ahupuaa layer:', {
            reason: 'no projects available'
          });
        }
        setIsZooming(false);
      }, 1000);
    }
  }, [selected, lastSelectedAhupuaa, selectedProject, isZooming, resetToInitialState]);

  const handleProjectClick = (feature, layer, e, bypassZoomCheck = false) => {
    const projectName = feature.properties.name;
    const ahupuaaName = feature.properties.ahupuaa;
    const isReclick = projectName === selectedProject;

    console.log('DEBUG: Project click detected:', {
      clickedProject: projectName,
      currentlySelected: selectedProject,
      isReclick,
      activeLayer,
      isZooming,
      bypassZoomCheck,
      state: {
        selected,
        selectedProject,
        activeLayer,
        isZooming
      }
    });

    if (activeLayer !== 'projects') {
      console.log('BLOCKED: Project click - wrong layer:', {
        attempted: activeLayer,
        required: 'projects'
      });
      return;
    }

    // HACK: Allow bypassing zoom check when we've explicitly completed previous zoom
    if (isZooming && !bypassZoomCheck) {
      console.log('BLOCKED: Project click - zooming in progress');
      return;
    }

    // Only stop propagation on the original DOM event
    if (e.originalEvent) {
      console.log('INTERACTION: Stopping project click propagation');
      L.DomEvent.stopPropagation(e.originalEvent);
      L.DomEvent.preventDefault(e.originalEvent);
    }

    console.log('INTERACTION: Project click processing:', {
      type: 'project_click',
      name: projectName,
      ahupuaa: ahupuaaName,
      isReclick,
      currentState: {
        selected,
        selectedProject,
        activeLayer,
        isZooming
      }
    });

    const map = mapRef.current;
    if (map) {
      // Start zoom sequence
      setIsZooming(true);
      console.log('STATE: Setting zoom state:', {
        from: false,
        to: true,
        reason: 'project click',
        isReclick
      });

      // Set project and maintain ahupuaa selection
      console.log('STATE: Updating selections:', {
        project: {
          from: selectedProject,
          to: projectName,
          isReclick
        },
        ahupuaa: {
          from: selected,
          to: ahupuaaName
        }
      });

      // Always update selections, even on reclick
      setSelectedProject(projectName);
      setSelected(ahupuaaName);

      // Zoom to project bounds
      const bounds = layer.getBounds();
      console.log('ZOOM: Project zoom initiated:', {
        name: projectName,
        bounds: bounds,
        zoomLevel: feature.properties.zoom || 18,
        isReclick
      });

      // Always zoom, even on reclick
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: feature.properties.zoom || 18,
        animate: true,
        duration: 1
      });

      // After zoom completes, switch to plots layer while maintaining selections
      setTimeout(() => {
        console.log('ZOOM: Project zoom complete, transitioning to plots:', {
          project: projectName,
          ahupuaa: ahupuaaName,
          nextLayer: 'plots',
          isReclick
        });
        setActiveLayer('plots');
        setIsZooming(false);
      }, 1000);
    }
  };

  // Effect to monitor zoom state
  useEffect(() => {
    console.log('Zoom state changed:', {
      isZooming,
      activeLayer,
      selectedProject,
      selected
    });
  }, [isZooming]);

  // Effect to monitor project selection
  useEffect(() => {
    if (selectedProject) {
      console.log('Project selection changed:', {
        project: selectedProject,
        activeLayer,
        isZooming
      });
    }
  }, [selectedProject]);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      zoomSnap={0.1}
      maxZoom={22}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
      whenReady={({ target }) => onMapLoad(target)}
    >
      <FeatureGroup>
        <EditControl
          position='topright'
          draw={{
            rectangle: false
          }}
        />
      </FeatureGroup>
      <ResetViewControl
        center={center}
        zoom={zoom}
      />
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Satellite (Google)" checked>
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s,p&x={x}&y={y}&z={z}"
            maxNativeZoom={22}
            maxZoom={22}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street (Google)">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxNativeZoom={22}
            maxZoom={22}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Ahupuaa" checked>
            <GeoJSON
              ref={geoJSONRef}
              data={ahupuaaData}
              style={(feature) => {
                const ahupuaaName = feature.properties.ahupuaa;
                const isSelected = ahupuaaName === selected;
                const isAhupuaaLayer = activeLayer === 'ahupuaa';

                // Base style
                const style = {
                weight: 2,
                  color: '#228B22',
                  fillColor: '#228B22',
                fill: true,
                  fillOpacity: isAhupuaaLayer ? 0.1 : 0.02,
                  pane: 'ahupuaaPane'
                };

                // Add interaction properties
                if (!isAhupuaaLayer || isSelected) {
                  // Disable all interactions when not in ahupuaa layer or when selected
                  return {
                    ...style,
                    interactive: false,
                    pointerEvents: 'none',
                    className: 'pointer-events-none'
                  };
                }

                // Enable interactions only in ahupuaa layer for unselected features
                return {
                  ...style,
                  interactive: true,
                  pointerEvents: 'auto',
                  className: ''
                };
              }}
              onEachFeature={(feature, layer) => {
                // First, remove any existing event listeners
                layer.off();

                // Only attach click handlers if we're in ahupuaa layer
                if (activeLayer === 'ahupuaa') {
                  layer.on({
                    click: (e) => {
                      const ahupuaaName = feature.properties.ahupuaa;
                      console.log('INTERACTION: Ahupuaa polygon clicked:', {
                        type: 'ahupuaa',
                        name: ahupuaaName,
                        activeLayer,
                        isZooming,
                        hasClickTimer: !!clickTimerRef.current,
                        currentSelected: selected,
                        lastSelected: lastSelectedAhupuaa
                      });

                      // Always stop propagation for both single and double clicks
                      L.DomEvent.stopPropagation(e.originalEvent);
                      L.DomEvent.preventDefault(e.originalEvent);

                      // If there's a pending click timer, this is a double click - always allow for map zoom
                      if (clickTimerRef.current) {
                        console.log('INTERACTION: Double click detected on ahupuaa:', {
                          name: ahupuaaName,
                          action: 'allowing map zoom'
                        });
                        clearTimeout(clickTimerRef.current);
                        clickTimerRef.current = null;
                        return;
                      }

                      // Check if this is the most recently selected ahupuaa
                      const isCurrentOrLastAhupuaa = ahupuaaName === selected || ahupuaaName === lastSelectedAhupuaa;
                      if (isCurrentOrLastAhupuaa) {
                        console.log('BLOCKED: Ahupuaa single click blocked:', {
                          name: ahupuaaName,
                          reason: 'was most recently selected ahupuaa',
                          currentSelected: selected,
                          lastSelected: lastSelectedAhupuaa
                        });
                        return;
                      }

                      // Set a timer for potential double click
                      clickTimerRef.current = setTimeout(() => {
                        console.log('INTERACTION: Single click confirmed on ahupuaa:', {
                          name: ahupuaaName,
                          action: 'processing selection',
                          currentSelected: selected,
                          lastSelected: lastSelectedAhupuaa,
                          isCurrentOrLastAhupuaa
                        });
                        clickTimerRef.current = null;
                        handleAhupuaaClick(feature, layer, e);
                      }, DOUBLE_CLICK_DELAY);
                    }
                  });
                } else {
                  // When not in ahupuaa layer, ensure the layer is completely non-interactive
                  layer.setStyle({
                    interactive: false,
                    pointerEvents: 'none'
                  });
                  if (layer._path) {
                    layer._path.classList.add('pointer-events-none');
                  }
                  console.log('DEBUG: Ahupuaa layer disabled:', {
                    name: feature.properties.ahupuaa,
                    reason: `active layer is ${activeLayer}`,
                    state: {
                      interactive: false,
                      pointerEvents: 'none'
                    }
                  });
                }
              }}
              eventHandlers={{
                add: (e) => {
                  const layer = e.target;
                  console.log('MOUNT: Ahupuaa layer mounted:', {
                    selected,
                    activeLayer
                  });

                  // Disable all ahupuaa interactions when not in ahupuaa layer
                  layer.eachLayer((l) => {
                    const featureName = l.feature?.properties?.ahupuaa;
                    if (activeLayer !== 'ahupuaa' || featureName === selected) {
                      console.log('DISABLE: Ahupuaa layer disabled:', {
                        name: featureName,
                        reason: activeLayer !== 'ahupuaa' ? 'wrong layer' : 'selected ahupuaa'
                      });
                      l.setStyle({
                        interactive: false,
                        pointerEvents: 'none'
                      });
                      if (l._path) {
                        l._path.classList.add('pointer-events-none');
                      }
                      // Add explicit click prevention
                      if (l._container) {
                        l._container.style.pointerEvents = 'none';
                      }
                    } else {
                      console.log('ENABLE: Ahupuaa layer enabled:', {
                        name: featureName,
                        reason: 'in ahupuaa layer and not selected'
                      });
                      l.setStyle({
                        interactive: true,
                        pointerEvents: 'auto'
                      });
                      if (l._path) {
                        l._path.classList.remove('pointer-events-none');
                      }
                      // Remove click prevention
                      if (l._container) {
                        l._container.style.pointerEvents = '';
                      }
                    }
                  });
                }
              }}
            />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Projects">
          <GeoJSON
            key={`projects-${selected}-${activeLayer}`}
            data={projectsGeoJSON}
            style={(feature) => {
              const isActive = activeLayer === 'projects';
              return {
                color: '#2196f3',
                weight: 2,
                opacity: 1,
                fillColor: '#2196f3',
                fillOpacity: activeLayer === 'projects' ? 0.4 : 0,
                interactive: true,
                pointerEvents: 'auto',
                pane: 'projectsPane'
              };
            }}
            onEachFeature={(feature, layer) => {
              // Clear existing handlers
              layer.off();

              // Always attach click handler
              layer.on({
                click: (e) => {
                  const projectName = feature.properties.name;
                  console.log('INTERACTION: Project polygon clicked:', {
                    type: 'project',
                    name: projectName,
                    ahupuaa: feature.properties.ahupuaa,
                    activeLayer,
                    isZooming,
                    hasSelectedProject: !!selectedProject,
                    isReclick: projectName === selectedProject
                  });

                  // First check if we're in the right layer
                  if (activeLayer !== 'projects') {
                    console.log('BLOCKED: Project interaction blocked:', {
                      name: projectName,
                      reason: 'wrong layer'
                    });
                    return;
                  }

                  // HACK: If we're completing a previous zoom, bypass the zoom check
                  let bypassZoom = false;
                  if (isZooming) {
                    console.log('STATE: Completing previous zoom');
                    setIsZooming(false);
                    bypassZoom = true;  // Set flag to bypass zoom check
                  }

                  // Always handle the click, with zoom check bypass if needed
                  handleProjectClick(feature, layer, e, bypassZoom);
                }
              });
            }}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                console.log('MOUNT: Project layer mounted:', {
                  selected,
                  selectedProject,
                  activeLayer
                });

                // Always enable project layers
                layer.eachLayer((l) => {
                  const projectName = l.feature?.properties?.name;
                  console.log('ENABLE: Project layer enabled:', {
                    name: projectName,
                    reason: 'ensuring interactivity'
                  });
                  l.setStyle({
                    interactive: true,
                    pointerEvents: 'auto'
                  });
                  if (l._path) {
                    l._path.classList.remove('pointer-events-none');
                  }
                });
              }
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Plots">
          <GeoJSON
            key={`plots-${selectedProject}-${activeLayer}`}
            data={plotsGeoJSON}
            style={(feature) => {
              const isActive = activeLayer === 'plots';
              return {
                weight: 2,
                color: '#FF4081',
                fillColor: '#FF4081',
                fillOpacity: activeLayer === 'plots' ? 0.4 : 0,
                interactive: true, // Always interactive to catch clicks
                pointerEvents: 'auto',
                pane: 'plotsPane',
                className: isActive ? '' : 'pointer-events-none'
              };
            }}
            onEachFeature={(feature, layer) => {
              layer.off();

              // In plots view, attach click handlers
              if (activeLayer === 'plots') {
                layer.on({
                  click: (e) => {
                    // Always stop propagation in plots layer
                    L.DomEvent.stopPropagation(e.originalEvent);
                    L.DomEvent.preventDefault(e.originalEvent);

                    const plotName = feature.properties.name;
                    console.log('INTERACTION: Plot polygon clicked:', {
                      type: 'plot',
                      name: plotName,
                      projectName: feature.properties.projectName,
                      activeLayer,
                      isZooming
                    });

                    if (isZooming) {
                      console.log('BLOCKED: Plot interaction blocked:', {
                        name: plotName,
                        reason: 'zooming in progress'
                      });
                      return;
                    }

                    console.log('ZOOM: Plot zoom initiated:', {
                      name: plotName,
                      bounds: layer.getBounds()
                    });

                    const map = mapRef.current;
                    if (map) {
                      setIsZooming(true);
                      const bounds = layer.getBounds();
                      map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 20,
                        duration: 1
                      });
                      setTimeout(() => {
                        setIsZooming(false);
                        console.log('ZOOM: Plot zoom complete:', {
                          name: plotName
                        });
                      }, 1000);
                    }
                  }
                });
              }
            }}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                console.log('MOUNT: Plot layer mounted:', {
                  selected,
                  selectedProject,
                  activeLayer
                });

                // Always enable plot layers in plots view
                layer.eachLayer((l) => {
                  const plotName = l.feature?.properties?.name;
                  console.log('ENABLE: Plot layer enabled:', {
                    name: plotName,
                    reason: 'plot layer active'
                  });
                  l.setStyle({
                    interactive: true,
                    pointerEvents: 'auto'
                  });
                  if (l._path) {
                    l._path.classList.remove('pointer-events-none');
                  }
                });

                // Add click handler to the entire GeoJSON container to intercept all clicks
                if (layer._container && activeLayer === 'plots') {
                  console.log('DEBUG: Adding click interceptor to plots container');
                  layer._container.addEventListener('click', (e) => {
                    console.log('DEBUG: Plots container click intercepted');
                    e.stopPropagation();
                    e.preventDefault();
                  }, true); // Use capture phase to ensure we catch clicks before they propagate
                }
              }
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Sensor Stations">
          <LayerGroup>
            {sensors
              .filter(sensor => {
                // Show sensors based on active layer
                if (activeLayer === 'plots' && selectedProject) {
                  const shouldShow = sensor.projectName === selectedProject;
                  console.log('DEBUG: Filtering sensor for plots view:', {
                    sensorName: sensor.name,
                    sensorProject: sensor.projectName,
                    selectedProject,
                    shouldShow,
                    coordinates: [sensor.latitude, sensor.longitude]
                  });
                  return shouldShow;
                }
                if (activeLayer === 'projects' && selected) {
                  const shouldShow = sensor.ahupuaaName === selected;
                  console.log('DEBUG: Filtering sensor for projects view:', {
                    sensorName: sensor.name,
                    sensorAhupuaa: sensor.ahupuaaName,
                    selected,
                    shouldShow,
                    coordinates: [sensor.latitude, sensor.longitude]
                  });
                  return shouldShow;
                }
                return false;
              })
              .map((sensor, index) => {
                // IMPORTANT: Leaflet uses [latitude, longitude] order
                const position = [sensor.latitude, sensor.longitude];
                console.log('DEBUG: Rendering sensor marker:', {
                  name: sensor.name,
                  position,
                  project: sensor.projectName,
                  plot: sensor.plotName,
                  activeLayer
                });

                return (
                  <>
                    {/* Add a CircleMarker for debugging - this will always be visible */}
                    <CircleMarker
                      key={`debug-circle-${sensor.id || index}`}
                      center={position}
                      radius={10}
                      color="red"
                      fillColor="red"
                      fillOpacity={0.5}
                      weight={2}
                      pane="sensorsPane"
                    >
                      <Popup>
                        <div>
                          <h3>Debug: {sensor.name}</h3>
                          <p>Coordinates: {position.join(', ')}</p>
                          <p>Project: {sensor.projectName}</p>
                          {sensor.plotName && <p>Plot: {sensor.plotName}</p>}
                        </div>
                      </Popup>
                    </CircleMarker>

                    {/* Regular marker with icon */}
                    <Marker
                      key={`sensor-${sensor.id || index}`}
                      position={position}
                      icon={sensorIcon}
                      pane="sensorsPane"
                      eventHandlers={{
                        add: (e) => {
                          console.log('DEBUG: Sensor marker added to map:', {
                            name: sensor.name,
                            position,
                            layer: e.target
                          });
                        },
                        click: (e) => {
                          L.DomEvent.stopPropagation(e.originalEvent);
                          console.log('INTERACTION: Sensor clicked:', {
                            type: 'sensor',
                            name: sensor.name,
                            project: sensor.projectName,
                            plot: sensor.plotName,
                            activeLayer,
                            position
                          });

                          if ((activeLayer === 'plots' || activeLayer === 'projects') && !isZooming) {
                            const map = mapRef.current;
                            if (map) {
                              setIsZooming(true);
                              map.setView(position, 20, {
                                animate: true,
                                duration: 1
                              });
                              setTimeout(() => {
                                setIsZooming(false);
                                console.log('ZOOM: Sensor zoom complete:', {
                                  name: sensor.name,
                                  position
                                });
                              }, 1000);
                            }
                          }
                        }
                      }}
                    >
                      <Popup>
                        <div>
                          <h3>{sensor.name}</h3>
                          <p>Coordinates: {position.join(', ')}</p>
                          <p>Project: {sensor.projectName}</p>
                          {sensor.plotName && <p>Plot: {sensor.plotName}</p>}
                          <p>{sensor.metadata.description}</p>
                          <p>Latest Value: {sensor.data[sensor.data.length - 1].value} {sensor.metadata.unit}</p>
                        </div>
                    </Popup>
                    </Marker>
                  </>
                );
              })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <Info position="bottomleft" selected={selected} selectedProject={selectedProject} />
    </MapContainer>
  )
}

export default Map
