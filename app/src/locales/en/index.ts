import YAML from 'js-yaml'

// @index: import ${variable}String from ${relpathwithext}
import cocktailString from './cocktail.yml'
import colanderString from './colander.yml'
import cropcircleString from './cropcircle.yml'
import endgameString from './endgame.yml'
import invitationString from './invitation.yml'
import startString from './start.yml'
// /index

const en = {
  // @index: ...YAML.load(${variable}String) as any,
  ...YAML.load(cocktailString) as any,
  ...YAML.load(colanderString) as any,
  ...YAML.load(cropcircleString) as any,
  ...YAML.load(endgameString) as any,
  ...YAML.load(invitationString) as any,
  ...YAML.load(startString) as any,
  // /index
}
export default en