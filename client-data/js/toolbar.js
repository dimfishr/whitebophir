ToolBar = {}

ToolBar.init = function () {
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
    ToolBar.setSize(Tools.getSize());
    ToolBar.setTool(Tools.curTool);
}

ToolBar.setColor = function(index, color) {
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
    let newSize = Tools.setSize(Tools.getSize() + 1);
    ToolBar.sizeElement.value = newSize.toString();
}

ToolBar.decrementSize = function() {
    let newSize = Tools.setSize(Tools.getSize() - 1);
    ToolBar.sizeElement.value = newSize.toString();
}

ToolBar.setSize = function(size) {
    let newSize = Tools.setSize(size);
    ToolBar.sizeElement.value = newSize.toString();
}

ToolBar.incrementOpacity = function() {
    let chooser = document.getElementById("chooseOpacity");
    let opacityIndicator = document.getElementById("opacityIndicator");
    let value = Math.max(0.1, Math.min(1, parseFloat(chooser.value) + 0.1));
    opacityIndicator.setAttribute("opacity", value);
    chooser.value = value;
    ToolBar.opacityElement.value = value.toFixed(2) * 100;
}

ToolBar.decrementOpacity = function() {
    let chooser = document.getElementById("chooseOpacity");
    let opacityIndicator = document.getElementById("opacityIndicator");
    let value = Math.max(0.1, Math.min(1, parseFloat(chooser.value) - 0.1));
    opacityIndicator.setAttribute("opacity", value);
    chooser.value = value;
    ToolBar.opacityElement.value = value.toFixed(2) * 100;
}

ToolBar.setOpacity = function(opacity) {
    let chooser = document.getElementById("chooseOpacity");
    let opacityIndicator = document.getElementById("opacityIndicator");
    let value = Math.max(0.1, Math.min(1, parseFloat(opacity) - 0.1));
    opacityIndicator.setAttribute("opacity", value);
    chooser.value = value;
    ToolBar.opacityElement.value = value.toFixed(2) * 100;
}

ToolBar.toggleGrid = function() {
    Tools.change('Grid');
}

ToolBar.init();
