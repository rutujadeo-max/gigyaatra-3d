export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong') => {
  const fieldErrors = error?.response?.data?.errors

  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    return fieldErrors.map((fieldError) => fieldError.message).join(' ')
  }

  return error?.response?.data?.message || fallbackMessage
}
