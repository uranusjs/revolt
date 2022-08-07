const { RestClient, ServersRoute, RestAction } = require('@uranusjs/rest-revolt')
const rest = new RestClient({
  sessionToken: '6UR3YSN_SCC0CoNbJGn1XAir5By3TVdtUnff9aUsC5KapPef0W1qTSXKh5XbgaSk'
})





const create = async () => {
  await rest.createRequest(ServersRoute.MEMBER_FETCH('01FFP0813XTASFCVBP0H97912T'), {
    isRequiredAuth: true,
    queue: (data) => { console.log(data) },
    err: (err) => {
      console.log(err.response.data)
    }

  })
  console.log(rest.bucketManager)
}

create()

