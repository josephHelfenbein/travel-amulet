import {useField} from 'formik';
import {TextField, MenuItem} from '@mui/material';
import { useState, useEffect } from 'react';

const FormikMultiSelect = ({label, ...props}) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    const [widthUsing, setWidthUsing] = useState("100%");
    useEffect(()=> {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
            setWidthUsing('75vw');
    })
    return (
        <TextField
            select
            label={label}
            {...field}
            SelectProps={{multiple:true,}}
            helperText={errorText}
            error={!!errorText}
            variant="outlined"
            style={{backgroundColor:"white", borderRadius:'5px', width:`${widthUsing}`}}
            
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
export default FormikMultiSelect