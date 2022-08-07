const { RestClient, ServersRoute, RestAction } = require('@uranusjs/rest-revolt')
const rest = new RestClient({
  sessionToken: ''
})





const create = async () => {
  await rest.createRequest(ServersRoute.MEMBER_FETCH(''), {
    isRequiredAuth: true,
    queue: (data) => { console.log(data) },
    err: (err) => {
      console.log(err.response.data)
    }

  })
  console.log(rest.bucketManager)
}

create()

