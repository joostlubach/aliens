// @index(\.json$): import ${variable} from ${relpathwithext}
import miscYml from './misc.yml.json'
import qrYml from './qr.yml.json'
// /index

const en = {
  // @index(\.json$): ...${variable},
  ...miscYml,
  ...qrYml,
  // /index
}
export default en