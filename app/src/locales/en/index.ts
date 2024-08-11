// @index(\.json$): import ${variable} from ${relpathwithext}
import cocktailYml from './cocktail.yml.json'
import colanderYml from './colander.yml.json'
import cropYml from './crop.yml.json'
import endgameYml from './endgame.yml.json'
import invitationYml from './invitation.yml.json'
import miscYml from './misc.yml.json'
import qrYml from './qr.yml.json'
import startYml from './start.yml.json'
import typerYml from './typer.yml.json'
// /index

const en = {
  // @index(\.json$): ...${variable},
  ...cocktailYml,
  ...colanderYml,
  ...cropYml,
  ...endgameYml,
  ...invitationYml,
  ...miscYml,
  ...qrYml,
  ...startYml,
  ...typerYml,
  // /index
}
export default en