

function relativeMousePos(event, target) {


  var rect = target.getBoundingClientRect();

  return {x: event.clientX - rect.left, y: event.clientY - rect.top}
}

// assumes target or event.target is canvas
export function getCanvasMousePos(event,target) {


    var pos = relativeMousePos(event, target);

    pos.x = pos.x * target.width  / target.clientWidth;
    pos.y = pos.y * target.height / target.clientHeight;
    return pos;
}