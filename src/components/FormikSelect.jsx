import {useField} from 'formik';
import {TextField, MenuItem} from '@mui/material';

const FormikSelect = ({label, initialValue, ...props}) => {
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
            fullWidth
        >
            {
                props.options.map((option) => (
                    <MenuItem key={option.value} value={option.value} placeholder={initialValue}>
                        {option.label}
                    </MenuItem>
                ))
            }
        </TextField>
    );
};
export default FormikSelect