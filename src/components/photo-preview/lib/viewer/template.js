import { NAMESPACE } from './constants';
export default (
  '<div class="'+NAMESPACE+'-container" touch-action="none">'
    + '<div class="'+NAMESPACE+'-canvas"></div>'
    + '<div class="'+NAMESPACE+'-footer">'
      + '<div class="'+NAMESPACE+'-title"></div>'
      + '<div class="'+NAMESPACE+'-toolbar"></div>'
      + '<div class="'+NAMESPACE+'-navbar">'
        + '<ul class="'+NAMESPACE+'-list"></ul>'
      + '</div>'
    + '</div>'
    + '<div class="'+NAMESPACE+'-tooltip"></div>'
    + '<div class="'+NAMESPACE+'-top-right-bar" >'
    +   '<div role="button" class="'+NAMESPACE+'-button" data-'+NAMESPACE+'-action="mix"></div>'
    + '</div>'
    + '<div class="'+NAMESPACE+'-player"></div>'
  + '</div>'
);
