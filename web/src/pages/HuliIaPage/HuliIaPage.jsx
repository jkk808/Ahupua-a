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
    </>
  )
}

export default HuliIaPage
