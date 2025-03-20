import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

const SensorForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.sensor?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.sensor?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="location"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Location
        </Label>

        <TextField
          name="location"
          defaultValue={props.sensor?.location}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="location" className="rw-field-error" />

        <Label
          name="latitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Latitude
        </Label>

        <TextField
          name="latitude"
          defaultValue={props.sensor?.latitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          type="number"
          step="any"
        />

        <FieldError name="latitude" className="rw-field-error" />

        <Label
          name="longitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Longitude
        </Label>

        <TextField
          name="longitude"
          defaultValue={props.sensor?.longitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          type="number"
          step="any"
        />

        <FieldError name="longitude" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default SensorForm
