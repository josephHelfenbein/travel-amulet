import * as Yup from 'yup';

const validationSchema = Yup.object({
    singleSelect: Yup.string().required('Required'),
});
export default validationSchema;