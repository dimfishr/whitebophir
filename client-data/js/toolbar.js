ToolBar = {}

ToolBar.init = function () {
    window.addEventListener('message', event => {
        if (event.data?.type === 'fontResize' && event.data?.data) {
            const toolRow = document.querySelector(".tool__row");
            toolRow.style.fontSize = `${event.data.data}px`;
        }
    });
    ToolBar.rootElement = document.getElementById("toolbar");
    if(ToolBar.rootElement === null) {
        console.error("Toolbar root element with id toolbar not found. Toolbar won't work!")
    }
    ToolBar.sizeElement = document.getElementById('weight');
    if(ToolBar.rootElement === null) {
        console.error("Size textbox with id weight not found. Size changing won't work");
    }

    ToolBar.currentColorButton = document.getElementById('tool__current_color');
    if(ToolBar.currentColorButton === null) {
        console.error("Current color btn with id tool__current_color not found. Color changing won't work");
    }
    ToolBar.weightColorButton = document.getElementById('tool__weight_color');
    if(ToolBar.weightColorButton === null) {
        console.error("Current color btn with id tool__weight_color not found. Color changing won't work");
    }
    ToolBar.opacityElement = document.getElementById('opacity');
    if(ToolBar.opacityElement === null) {
        console.error("Opacity element with id opacity not found. Color changing won't work");
    }
    ToolBar.opacityIconElement = document.getElementById('tool__opacity_icon');
    if(ToolBar.opacityIconElement === null) {
        console.error("Opacity icon element with id tool__opacity_icon not found. Color changing won't work");
    }
    ToolBar.setTool(Tools.curTool === null ? 'Pencil' : Tools.curTool.name);
    ToolBar.setSize(Tools.getSize());
    ToolBar.setColor(Tools.getColor());
    ToolBar.setOpacity(Tools.getOpacity());

    const params = new URLSearchParams(window.location.search);
    if(params.get('theme') === 'dark') {
        ToolBar.rootElement.classList.add('dark');
    }
    
    const fontSize = params.get('fontSize');
}

ToolBar.setColor = function(color) {
    Tools.setColor(color);
    ToolBar.currentColorButton.style.backgroundColor = color;
    ToolBar.weightColorButton.style.backgroundColor = color;
}

ToolBar.setTool = function (name) {
    if(name === null) {
        return;
    }
    let toolElementName = 'tool-' + name;
    let toolButton = document.getElementById(toolElementName);
    if(toolButton === null) {
        console.error("Toolbar element " + toolElementName + ' for tool ' + name + ' not found. Tool switch wont happen!');
        return;
    }
    Tools.change(name);
    let activeToolButton = ToolBar.activeToolButton;
    if(activeToolButton != null) {
        activeToolButton.classList.remove('active');
    }
    toolButton.classList.add('active');
    ToolBar.activeToolButton = toolButton;
}

ToolBar.incrementSize = function() {
    ToolBar.setSize(Tools.getSize() + 1);
}

ToolBar.decrementSize = function() {
    ToolBar.setSize(Tools.getSize() - 1);
}

ToolBar.setSize = function(size) {
    let newSize = Tools.setSize(size);
    ToolBar.sizeElement.value = newSize.toString();
    ToolBar.weightColorButton.style.height = Math.min(newSize, 30).toString() + 'px';
    ToolBar.weightColorButton.style.width = Math.min(newSize, 30).toString() + 'px';
}

ToolBar.incrementOpacity = function() {
    let chooser = document.getElementById("chooseOpacity");
    ToolBar.setOpacity(parseFloat(chooser.value) + 0.1);
}

ToolBar.decrementOpacity = function() {
    let chooser = document.getElementById("chooseOpacity");
    ToolBar.setOpacity(parseFloat(chooser.value) - 0.1);
}

ToolBar.setOpacity = function(opacity) {
    let chooser = document.getElementById("chooseOpacity");
    let opacityIndicator = document.getElementById("opacityIndicator");
    let value = Math.max(0.1, Math.min(1, opacity));
    opacityIndicator.setAttribute("opacity", value);
    chooser.value = value;
    ToolBar.opacityElement.value = value.toFixed(2) * 100;
    ToolBar.opacityIconElement.style.opacity = (value.toFixed(2) * 100).toString() + '%';
}

ToolBar.toggleGrid = function() {
    Tools.change('Grid');
}



ToolBar.clearBoard = function() {
    var msg = {
        "type": "clear",
        "id": "",
        "token": Tools.token
    };
    Tools.drawAndSend(msg, Tools.list["Clear"]);
}

ToolBar.init();
