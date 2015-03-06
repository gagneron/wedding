var mouse = {};
var mouseStatus = null;
var pic = {};
var zindex = 0;
var picHeight = 112.5;
var picWidth = 150;
var puzzle =  {
    pieces: {},
    numUnits: 0,
    width: 4,
    height: 4,
    positions: []
};
puzzle.total = puzzle.width*puzzle.height;

var Position = function(x, y) {
    this.x = x;
    this.y = y;
}

createGrid();
createPieces();

function createGrid() {
    var html = "";
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var cursor = 0;
    for (var i = 0; i < puzzle.height; i++) {
        html += '<tr>';
        for (var j = 0; j < puzzle.width; j++) {
            html += '<td><div id="'+alphabet[cursor]+'" class="grid-cell"'+
                    'style="width:'+(picWidth+60)+'px;height:'+(picHeight+30)+'px;">'+
                    '</div></td>';
            cursor++;
        }
        html += '</tr>';
    }
    $('#grid').append(html);
}

function createPieces() {
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    html = "";
    var x = 0;
    var y = -picHeight;
    var puzzleHeight = 400;
    var puzzleWidth = 800;
    var grid = [];
    for (var i = 0; i < puzzle.total; i++) {
        grid.push(alphabet[i]);
    }
    grid.sort(function() { return 0.5 - Math.random()});
    for (var i = 0; i < puzzle.total; i++) {            
        x = $('#grid #'+grid[i]).offset().left + Math.floor(Math.random()*20 - 10);
        y = $('#grid #'+grid[i]).offset().top + Math.floor(Math.random()*20 - 10);


        html += '<div id="'+alphabet[i]+'" class="pic"'+
                'style="top:'+y+'px;left:'+x+'px;">';
        html += '<div class="image"></div>';
        if (i < puzzle.total - puzzle.width) {
            html += '<div class="side bottom">'+
                        '<span class="'+
                        alphabet[i]+alphabet[i+puzzle.width]+
                        '"></span>'+
                    '</div>';
        }
        if (i >= puzzle.width) {
            html += '<div class="side top">'+
                        '<span class="'+
                        alphabet[i]+alphabet[i-puzzle.width]+
                        '"></span>'+
                    '</div>';
        }
        if (i % puzzle.width != 0) {
            html += '<div class="side left">'+
                        '<span class="'+
                        alphabet[i]+alphabet[i-1]+
                        '"></span>'+
                    '</div>';
        }
        if (i % puzzle.width != puzzle.width-1) {
            html += '<div class="side right">'+
                        '<span class="'+
                        alphabet[i]+alphabet[i+1]+
                        '"></span>'+
                    '</div>';
        }
        html += '</div>';
        // x += picWidth;

    }
    $('#puzzle').append(html);
    $('#grid').remove();
}

(function() {
    $('.pic').each(function() {
        var id = $(this).attr('id');

        puzzle.pieces[id] = null;
        $(this).mousedown({target: $(this)}, mousedown);
    });
})();

$(document).ready(function() {
    $('.bubble').css({'transform': 'translateX(300px)', 'opacity': 1});
});

$(document).mousemove(function(event) {
    if (mouseStatus != "dragging") {
        return;
    }
    var left = event.pageX - pic.offsetX;
    var top = event.pageY - pic.offsetY;
    pic.obj.css({'left':left, 'top':top});
    
});

var victorious = false;
$(document).mouseup(function() {
    if (mouseStatus == null) {
        return;
    }
    mouseStatus = null;
    pic.obj.removeClass('grabbing');
    checkForMatch();
    if ($('.unit:first').children().length == puzzle.total) {
        if (!victorious) {
           displayForm();
        }
    }
});

function displayForm() {
    $('body').css('overflow', 'visible');
    $('.unit').addClass('animate'); 
    $('#congrats').addClass('animate'); 

    setTimeout(function() {
        $('.unit').addClass('top'); 
    }, 1);
    
    setTimeout(function() {
        $('#congrats').removeClass('animate');
    }, 2000);

    setTimeout(function() {
        $('.unit').fadeOut(600, function() {
            $('.victory').fadeIn(1000);
        });
    }, 2600);
    
    victorious = true;
}

function mousedown(event) {
    if (event.which == 3) {
        return false;
    }
    setTimeout(function() {
        $('.bubble').css({'opacity':0});
        setTimeout(function() {
            $('.bubble').remove();
        }, 500);
    }, 500);
    mouseStatus = "dragging";
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    pic.obj = event.data.target;
    pic.startX = pic.obj.offset().left;
    pic.startY = pic.obj.offset().top;
    pic.offsetX = mouse.x - pic.startX;
    pic.offsetY = mouse.y - pic.startY;
    pic.obj.addClass('grabbing');
    pic.obj.css({'z-index':++zindex});
}

function checkForMatch() {
    var id = pic.obj.attr('id');
    var proximity = 20;
    pic.obj.find('.side').each(function() {
        var target = $(this).find('span');
        var targetName = target.attr('class');
        targetName = targetName[1] + targetName[0];
        if (target.offset().left > $('.'+targetName).offset().left-proximity &&
            target.offset().left < $('.'+targetName).offset().left+proximity && 
            target.offset().top > $('.'+targetName).offset().top-proximity &&
            target.offset().top < $('.'+targetName).offset().top+proximity) {
                snapTogether(targetName, $(this).parent());
                pic.obj = $('#'+joinTogether(targetName));
                $(this).remove();
                $('.'+targetName).parent().remove();
        }
    });
}

function snapTogether(targetName, actionPiece) {
    var side = $('.'+targetName).parent();
    var targetPic = side.parent();
    var targetTop = targetPic.offset().top;
    var targetLeft = targetPic.offset().left;
    var posX, posY;
    if (side.hasClass('top')) {
        posY = targetTop - picHeight;
        posX = targetLeft;
    } else if (side.hasClass('right')) {
        posY = targetTop;
        posX = targetLeft + picWidth;
    } else if (side.hasClass('bottom')) {
        posY = targetTop + picHeight;
        posX = targetLeft;
    } else if (side.hasClass('left')) {
        posY = targetTop;
        posX = targetLeft - picWidth;
    }
    var parentLeft = actionPiece.parent().offset().left;
    var parentTop = actionPiece.parent().offset().top;
    var originalTop = pic.obj.offset().top;
    var originalLeft = pic.obj.offset().left;
    var desiredY = originalTop + (posY-actionPiece.offset().top);
    var desiredX = originalLeft + (posX-actionPiece.offset().left);
    pic.obj.css({'top': desiredY+'px', 'left': desiredX+'px'});
}

function joinTogether(targetName) {
    // find the leftmost and topmost squares
    // wrap the squares in a container
    // position that container with the coordinates
    // of the leftmost and topmost squares
    // 

    var actionPiece = pic.obj.attr('id');
    var targetEl = $('.'+targetName).closest('.pic');
    var targetPiece = targetEl.attr('id'); 
    return createNewUnit(targetEl);
}

function createNewUnit(targetEl) {
    
    var jointId = getJointId(targetEl);
    var pos = getNewUnitCoors(jointId);
    var newUnit = $('<div id="'+jointId+'" class="unit" style="left:'+pos.left+'px;top:'+pos.top+'px;"></div>');
    $('#puzzle').append(newUnit);
    for (var i = 0; i < jointId.length; i++) {

        var el = $('#'+jointId[i]);
        var selfLeft = el.offset().left;
        var selfTop = el.offset().top;
        newUnit.append(el);
        var parentLeft = el.parent().offset().left;
        var parentTop = el.parent().offset().top;
        
        var left = selfLeft-parentLeft;
        var top = selfTop-parentTop;
        el.css({left: left, top: top});
        
    }
    $('.unit').filter(function() {
        return $(this).children().length == 0;
    }).remove();
    pic.obj.off('mousedown', mousedown);
    targetEl.off('mousedown', mousedown);
    newUnit.mousedown({target:newUnit},mousedown);
    return jointId;
}

function getNewUnitCoors(jointId) {
    var leftX = 9999;
    var topX = 9999;

    for (var i = 0; i < jointId.length; i++) {
        var left = $('#'+jointId[i]).offset().left;
        var top = $('#'+jointId[i]).offset().top;
        if (left < leftX) {
            leftX = left;
        }
        if (top < topX) {
            topX = top;
        }

    }
    return {left:leftX, top:topX};
}

function getJointId(targetEl) {

    var jointId = [];
    pushUnitsIntoArray(pic.obj, jointId);
    pushUnitsIntoArray(targetEl, jointId);
    var pieces = jointId.join("");
    for (var i = 0; i < pieces.length; i++) {
        puzzle.pieces[pieces[i]] = puzzle.numUnits;
    }
    puzzle.numUnits++;

    return jointId.sort().join("");
}

function pushUnitsIntoArray(el, jointId) {
    var actionId = el.attr('id');

    var unitNum = puzzle.pieces[actionId];
    if (unitNum == null) {
        jointId.push(actionId);
    } else {
        for (piece in puzzle.pieces) {
            if (puzzle.pieces[piece] == unitNum) {
                jointId.push(piece);
                
            }
        }
    }
}

$(document).ready(function(){
    $('form').submit(function() {
        $('#nameField').val(window.location.search.slice(1));
        setTimeout(function() {
            $.post("email.php", $('form').serialize(),  function(response) {
               console.log(response);
            });
            $('h1').text('Thank you for submitting your response!');
            setTimeout(function() {
                window.location.href = "http://lizandrudy.com/#section4";
            }, 1000);
        }, 0);
        return false;
    });
});

//load proper image
(function() {
    var name = window.location.search.slice(1);
    $('head').append('<link rel="stylesheet" type="text/css" href="../css/'+name+'.css">');
})();