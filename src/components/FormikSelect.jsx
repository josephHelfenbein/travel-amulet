import {useField} from 'formik';
import {TextField, MenuItem} from '@mui/material';

const FormikSelect = ({label, ...props}) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";

    return (
        <TextField
            select
            label={label}
            {...field}
            helperText={errorText}
            error={!!errorText}
            variant="outlined"
            style={{ backgroundColor:"white" }}
            fullWidth
        >
            {
                props.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))
            }
        </TextField>
    );
};
export default FormikSelect