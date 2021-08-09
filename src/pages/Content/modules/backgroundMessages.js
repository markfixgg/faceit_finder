export const sendBackgroundMessage = async ({type, message, body}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({type, message, body}, response => {
      resolve(response)
    })
  })
}