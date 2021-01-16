

function relativeMousePos(event, target) {


  var rect = target.getBoundingClientRect();
  if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
    var e = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
    var touch = e.touches[0] || e.changedTouches[0];
    return {x: touch.pageX - rect.left, y: touch.pageY - rect.top}
  }
  else {
    return {x: event.clientX - rect.left, y: event.clientY - rect.top}
  }
  
}

// assumes target or event.target is canvas
export function getCanvasMousePos(event,target) {


    var pos = relativeMousePos(event, target);

    pos.x = pos.x * target.width  / target.clientWidth;
    pos.y = pos.y * target.height / target.clientHeight;
    return pos;
}