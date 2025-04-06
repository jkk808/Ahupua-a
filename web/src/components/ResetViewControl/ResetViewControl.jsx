import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent, Util } from "leaflet";
import './ResetViewControl.css'

const _getControl = Control.extend({
  options: {
      position: "topleft",
      title: "Reset view",
      zoom: null,
  },

  onAdd: function(map) {

      this._map = map;

      this._container = L.DomUtil.create("div", "leaflet-control-resetview leaflet-bar leaflet-control");
      this._link = L.DomUtil.create("a", "leaflet-bar-part leaflet-bar-part-single", this._container);
      this._link.title = this.options.title;
      this._link.href = "#";
      this._link.setAttribute("role", "button");
      this._icon = L.DomUtil.create("span", "leaflet-control-resetview-icon", this._link);

      L.DomEvent.on(this._link, "click", this._resetView, this);

      return this._container;
  },

  onRemove: function(map) {
      L.DomEvent.off(this._link, "click", this._resetView, this);
  },

  _resetView: function(e) {
      this._map.setView(this.options.center, this.options.zoom);
  },
});

L.control.resetView = function(options) {
  return new ResetView(options);
};

const _createControl = (props) => new _getControl(props);

const ResetViewControl = createControlComponent(_createControl);
export default ResetViewControl;
