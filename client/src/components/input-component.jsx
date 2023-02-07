import PropTypes from 'prop-types';

function InputField({ type, formFields, error }) {
	return (
		<div className='w-full my-6'>
			<input
				type={type || 'text'}
				className='rounded-full border-base-300 bg-neutral w-full px-4 py-2 outline-none border focus:border-secondary'
				placeholder={`Enter ${formFields.name}`}
				{...formFields}
			/>
			{error && (
				<p className='text-red-500 text-sm relative bottom-4 left-4 '>
					<span className=' capitalize '>{formFields.name}</span> is a required
					field.
				</p>
			)}
		</div>
	);
}

InputField.defaultProps = {
	type: null,
};

InputField.propTypes = {
	type: PropTypes.string,
	formFields: PropTypes.any.isRequired,
	error: PropTypes.object.isRequired,
};

export default InputField;
