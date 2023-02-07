import React from 'react';

export default function UpdateProduct() {
	return (
		<div className='prose prose-h1:text-4xl w-full py-4 max-w-6xl mx-auto'>
			<div className='flex justify-center items-center w-full'>
				<div className='w-1/2 rounded shadow-2xl p-8 m-4'>
					<h1 className='block w-full text-center text-white-800 text-2xl font-bold mb-6'>
						Add Crop
					</h1>
					<form action='/' method='post'>
						<div className='flex flex-col mb-4'>
							<label
								className='mb-2 font-bold text-lg text-white-900'
								htmlFor='crop_name'
							>
								Crop Name
							</label>
							<input
								className='input my-1 input-bordered input-primary w-full max-w-xl'
								type='text'
								name='crop_name'
								id='crop_name'
								placeholder='Enter Crop Name'
							/>
						</div>

						<div className='flex flex-col mb-4'>
							<label
								className='mb-2 font-bold text-lg text-white-900'
								htmlFor='location'
							>
								Location
							</label>
							<select
								className='select select-primary w-full max-w-xl my-1 cursor-pointer'
								name='loction'
								id='location'
							>
								<option disabled selected>
									Enter Your Location
								</option>
								<option>Mumbai</option>
								<option>Pune</option>
								<option>Raigad</option>
								<option>Mars</option>
							</select>
						</div>
						<div className='flex flex-col mb-4'>
							<label
								className='mb-2 font-bold text-lg text-white-900'
								htmlFor='email'
							>
								Quantity (In KGs)
							</label>
							<input
								className='input my-1 input-bordered input-primary w-full max-w-xl'
								type='number'
								name='quantity'
								id='quantity'
							/>
						</div>
						<div className='flex flex-col mb-4'>
							<label
								className='mb-2 font-bold text-lg text-white-900'
								htmlFor='password'
							>
								Price
							</label>
							<label class='input-group input-group-md'>
								<input
									type='text'
									value='0.099'
									class='input my-1 input-bordered input-primary w-full max-w-xl'
								/>
								<span className='text-white-700 flex'>ETH</span>
							</label>
						</div>
						<div className='flex flex-col mb-4'>
							<label
								className='mb-2 font-bold text-lg text-white-900'
								htmlFor='password'
							>
								Description
							</label>
							<textarea
								className='textarea textarea-primary'
								placeholder='Description'
							></textarea>
						</div>
						<div className='flex flex-col mb-4'>
							<label
								className='mb-2 font-bold text-lg text-white-900'
								htmlFor='password'
							>
								Image
							</label>
							<div className='flex justify-center items-center w-full'>
								<label
									htmlFor='dropzone-file'
									className='flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
								>
									<div className='flex flex-col justify-center items-center pt-5 pb-6'>
										<svg
											aria-hidden='true'
											className='mb-3 w-10 h-10 text-gray-400'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
											/>
										</svg>
										<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
											<span className='font-semibold'>Click to upload</span> or
											drag and drop
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400'>
											SVG, PNG, JPG or GIF (MAX. 800x400px)
										</p>
									</div>
									<input
										id='dropzone-file'
										type='file'
										className='hidden'
										multiple
									/>
								</label>
							</div>

							{/* <input className="form-control
                            block w-full px-3 py-1.5 text-base font-normal text-black-700 bg-white bg-clip-padding
                            border border-solid border-primary-5000 rounded transition ease-in-out m-0
                            focus:text-black-700 focus:bg- focus:border-blue-600 focus:outline-none" type="file" id="formFileMultiple" multiple/> */}
						</div>
						<button
							className='btn btn-secondary block flex justify-center w-full'
							type='submit'
						>
							Add Crop
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
