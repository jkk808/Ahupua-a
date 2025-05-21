// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useState } from 'react'
import { Form, Label, TextField, Submit } from '@redwoodjs/forms'


const HuliIaPage = () => {
  const [version, setVersion] = useState('lani')
  const handleChange = (event) => {
    setVersion(event.target.value)
  }
  const onSubmit = (data) => {
    console.log('Form Data:', data)
  }
  return (
    <>
      <Metadata title="HuliIa" description="HuliIa page" />

      <h1 className='text-xl pb-4'>
        Kilo Page
      </h1>
      <div>
        Borrowing from huli ʻia, an observational process documenting seasonal changes and shifts across entire landscapes, ma uka to ma kai and everything in between, above and around. It is a tool used to identify dominant correlating cycles to support and guide our management and best-practices in supporting a productive and thriving community: ʻĀina Momona.
      </div>
      <div className="p-6">
      <div className="mb-4">
        <label name="version" className="block mb-2 font-bold">
          Choose Area of Focus
        </label>
        <select
          name="version"
          value={version}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="lani">Lani</option>
          <option value="honua">Honua</option>
          <option value="kai">Kai</option>
        </select>
      </div>

      <Form onSubmit={onSubmit} className="space-y-4 border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 rounded-lg  ">
        {version === 'lani' && (
          <>
            <div className='grid grid-cols-2 gap-4'>

              <div className='grid grid-cols-2'>
                <div className=''>
                  <Label name="clouds" className='bold'> Clouds</Label>
                  <p className='text-sm'>high/mid/low, shape, color</p>
                </div>
                <TextField name="clouds" className="input drop-shadow-sm border" />
              </div>

              <div className='grid grid-cols-2'>
                  <div>
                    <Label name="wind">Wind</Label>
                    <p className='text-sm'>direction, strength, change</p>
                  </div>
                  <TextField name="wind" className="input drop-shadow-sm border" />
              </div>

            </div>
          </>
        )}

        {version === 'honua' && (
          <>
            <div className='grid grid-cols-2 gap-4'>

              <div className='grid grid-cols-2'>
                <div className=''>
                  <Label name="plants" className='bold'>Plants</Label>
                  <p className='text-sm'>flowering or fruiting</p>
                </div>
                <TextField name="plants" className="input drop-shadow-sm border" />
              </div>

              <div className='grid grid-cols-2'>
                  <div>
                    <Label name="birds">Birds</Label>
                    <p className='text-sm'>depart/arrive, present/absent</p>
                  </div>
                  <TextField name="birds" className="input drop-shadow-sm border" />
              </div>

            </div>
          </>
        )}

        {version === 'kai' && (
          <>
            <div className='grid grid-cols-2 gap-4'>

              <div className='grid grid-cols-2'>
                <div className=''>
                  <Label name="tide" className='bold'>Tide & Currents</Label>
                  <p className='text-sm'>time, strength, debris, foam</p>
                </div>
                <TextField name="clouds" className="input drop-shadow-sm border" />
              </div>

              <div className='grid grid-cols-2'>
                  <div>
                    <Label name="waves">Waves</Label>
                    <p className='text-sm'>swell, ocean conditions</p>
                  </div>
                  <TextField name="waves" className="input drop-shadow-sm border" />
              </div>

            </div>
          </>
        )}

        <Submit className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </Submit>
      </Form>
    </div>
      <p style="font-size:8pt; line-height:1.4;">
  Mahalo to <a href="https://www.namakaonaona.org/" target="_blank" rel="noopener noreferrer">Nā Maka Onaona</a> and Pelika Andrade for their foundational work, ʻike, and contributions to ʻāina-based education and community research; this project draws from materials and insights shared on <a href="https://auamo.org" target="_blank" rel="noopener noreferrer">Auamo.org</a> and is deeply grateful for the ʻike shared by cultural practitioners, researchers, and community leaders featured in these platforms; this work is intended for <strong>research purposes only</strong>, unless otherwise explicitly permitted or noted—please cite responsibly and with aloha.
  </p>

{/*     <p>
        Mahalo to Auamo.org for providing this resource to aid na kilo ʻāina & huli ʻia.
    </p> */}
    </>
  )
}

export default HuliIaPage
