const baseURL = 'http://localhost:3000'
const signInURL = baseURL + '/signin'
const signUpURL = baseURL + '/signup'
const validProductURL = baseURL + '/validproduct'
const validSizesURL = baseURL + '/validsizes'
const newOrderURL = baseURL + '/neworder'
const getCurrentUserOrdersURL = baseURL + '/getcurrentuserorders'

const post = (url, dataObject) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataObject)
  }).then(resp => resp.json())

const postWithAuth = (url, dataObject) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.token
    },
    body: JSON.stringify(dataObject)
  }).then(resp => resp.json())


const getWithAuth = url =>
  fetch(url, {
    headers: {
      Authorization: localStorage.token
    }
  }).then(resp => resp.json())

const signIn = (usernameInput, passwordInput) => post(signInURL, { 
    username: usernameInput,
    password: passwordInput 
})

const signUp = (newUserObject) => post(signUpURL,{
  user: { 
    username: newUserObject.username,
    password: newUserObject.password,
    password_confirmation: newUserObject.password_confirmation
  }
})

const getSimple = (url) => fetch(url).then(resp => resp.json())

const getValidProduct = () => getSimple(validProductURL)

const getValidSizes = () => getSimple(validSizesURL)

const postOrder = (newOrderObject) => postWithAuth(newOrderURL,newOrderObject)

const getCurrentUserOrders = () => getWithAuth(getCurrentUserOrdersURL)

export default { signIn, signUp, getValidProduct, getValidSizes, postOrder, getCurrentUserOrders}
