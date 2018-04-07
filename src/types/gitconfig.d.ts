interface User {
  id?: string
  name: string
  email: string
  privateKey: string
}

interface Config {
  [index: string]: string | any
}

interface IObject {
  [index: string]: any
}
