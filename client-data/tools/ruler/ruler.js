(function () { //Изоляция кода

	var curLine = null; //Информация о текущей рисуемой линии
	var lastTime = performance.now(); //Время последнего изменения линии

	function UpdateMessage(x, y) {
		//Сообщение для отправки данных о линии на сервер
		this.type = 'update';
		this.id = curLine.id;
		this.x2 = x;
		this.y2 = y;
	}

	function startLine(x, y, evt) {
		//Начало рисования новой линии
		evt.preventDefault();

		curLine = {
			'type': 'ruler', //Тип линии - линейка
			'id': Tools.generateUID("r"), //"r" для линейки
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity(),
			'x': x,
			'y': y
		};

		Tools.drawAndSend(curLine); //Отправка данных о линии на сервер
	}

	function continueLine(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing line.
		This allows the animation to be smother*/
		console.log('curLine', curLine)
		if (curLine !== null) {
			if (lineTool.secondary.active) {
				var alpha = Math.atan2(y - curLine.y, x - curLine.x);
				var d = Math.hypot(y - curLine.y, x - curLine.x);
				var increment = 2 * Math.PI / 16;
				alpha = Math.round(alpha / increment) * increment;
				x = curLine.x + d * Math.cos(alpha);
				y = curLine.y + d * Math.sin(alpha);
			}
			if (performance.now() - lastTime > 70) {
				Tools.drawAndSend(new UpdateMessage(x, y));
				lastTime = performance.now();
			} else {
				draw(new UpdateMessage(x, y));
			}
		}
		if (evt) evt.preventDefault();
	}

	function stopLine(x, y) {
		//Окончание рисования линии
		continueLine(x, y);
		curLine = null;
	}

	function draw(data) {
		//Обработка данных о линии, полученных от сервера
		switch (data.type) {
			case "ruler":
				createLine(data);
				break;
			case "update":
				var line = svg.getElementById(data.id);
				if (!line) {
					console.error("Ruler: Попытка обновить несуществующую линию (%s).", data.id);
					createLine({ //create a new line in order not to loose the points
						"id": data['id'],
						"x": data['x2'],
						"y": data['y2']
					});
				}
				updateLine(line, data);
				break;
			default:
				console.error("Ruler: Получено сообщение с неизвестным типом. ", data);
				break;
		}
	}

	var svg = Tools.svg;

	function createLine(lineData) {
		//Создание новой линии
		var line = svg.getElementById(lineData.id) || Tools.createSVGElement("line");
		line.id = lineData.id;
		line.x1.baseVal.value = lineData['x'];
		line.y1.baseVal.value = lineData['y'];
		line.x2.baseVal.value = lineData['x2'] || lineData['x'];
		line.y2.baseVal.value = lineData['y2'] || lineData['y'];
		line.setAttribute("stroke", "black");
		line.setAttribute("stroke-width", 2);
		line.setAttribute("opacity", Math.max(0.1, Math.min(1, lineData.opacity)) || 1);
		Tools.drawingArea.appendChild(line);

		// Вычисление длины линии
		var length = Math.sqrt(Math.pow(line.x2.baseVal.value - line.x1.baseVal.value, 2) + Math.pow(line.y2.baseVal.value - line.y1.baseVal.value, 2));

		const positionX =
			(+line.attributes.x1.value + +line.attributes.x2.value) / 2;
		const positionY =
			(+line.attributes.y1.value + +line.attributes.y2.value - 50) / 2;

		// Создание текста с длиной линии
		var text = Tools.createSVGElement("text");
		text.setAttribute("x", positionX);
		text.setAttribute("y", positionY);
		text.setAttribute("id", "text_" + lineData.id);
		text.setAttribute("font-size", "12");
		text.textContent = length.toFixed(2);
		Tools.drawingArea.appendChild(text);
		// Tools.drawingArea.appendChild(text);

		return line;
	}



	function updateLine(line, data) {
		//Обновление координат линии
		line.x2.baseVal.value = data['x2'];
		line.y2.baseVal.value = data['y2'];

		// Вычисление длины линии
		var length = Math.sqrt(Math.pow(line.x2.baseVal.value - line.x1.baseVal.value, 2) + Math.pow(line.y2.baseVal.value - line.y1.baseVal.value, 2));

		// Обновление текста с длиной линии
		var text = svg.querySelector("#text_" + data.id);
		if (text) {
			text.textContent = length.toFixed(2);
			const positionX =
				(+line.attributes.x1.value + +line.attributes.x2.value) / 2;
			const positionY =
				(+line.attributes.y1.value + +line.attributes.y2.value - 50) / 2;
			text.setAttribute("x", positionX);
			text.setAttribute("y", positionY);
		}
	}

	var lineTool = {
		"name": "Ruler",
		"shortcut": "r",
		"listeners": {
			"press": startLine,
			"move": continueLine,
			"release": stopLine,
		},
		"secondary": {
			"name": "Ruler line line",
			"icon": "tools/line/icon-straight.svg",
			"active": false,
		},
		"draw": draw,
		"mouseCursor": "crosshair",
		"icon": "tools/line/icon.svg",
		"stylesheet": "tools/line/line.css"
	};

	Tools.add(lineTool); // Добавление инструмента в приложение

})(); //Конец изоляции кода