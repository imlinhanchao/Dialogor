Dialogor = {
	Config : {
		resize  : false,
		move 	: true,
		width	: 400,
		height	: 300,
		type	: "iframe",
		content	: "#",
		title	: "Dialogor",
		doct	: window.document
	},
	
	OnLoad : function(selector, type)
	{
		if(undefined == selector) throw "Selector is undefined.";
		if(undefined == type) type = this.Conifg.type;
		var Elems = document.querySelectorAll(selector);
		for(i = 0; Elems && i < Elems.length; i++)
		{
			Elems[i].onclick = function() {
				var contents = ("a" == this.nodeName.toLowerCase()) ? this.href : this.dataset.content;
				if("id" == type) contents = contents.substring(contents.indexOf("#") + 1, contents.length);
				else if("text" == type) contents = this.dataset.msg;
				return Dialogor.Open({
					title : this.title, 
					type : type, 
					content : contents, 
					height : this.dataset.height, 
					width : this.dataset.width
				}) 
			}
		}
	},
	
	Default : function(config)
	{
		var ConfigTemp = this.Config;
		if(undefined == config)  return ConfigTemp;
		if(undefined != config.resize) 	ConfigTemp.resize	= config.resize;
		if(undefined != config.move) 	ConfigTemp.move		= config.move;
		if(undefined != config.width) 	ConfigTemp.width	= config.width;
		if(undefined != config.height) 	ConfigTemp.height	= config.height;
		if(undefined != config.type) 	ConfigTemp.type		= config.type;
		if(undefined != config.title) 	ConfigTemp.title	= config.title;
		if(undefined != config.content) ConfigTemp.content	= config.content;
		this.Config = ConfigTemp;
		return ConfigTemp;
	},
	
	GetConfig : function(config)
	{
		var ConfigTemp = this.Config;
		if(undefined == config)  return ConfigTemp;
		if(undefined != config.resize) 	ConfigTemp.resize	= config.resize;
		if(undefined != config.move) 	ConfigTemp.move		= config.move;
		if(undefined != config.width) 	ConfigTemp.width	= config.width;
		if(undefined != config.height) 	ConfigTemp.height	= config.height;
		if(undefined != config.type) 	ConfigTemp.type		= config.type;
		if(undefined != config.title) 	ConfigTemp.title	= config.title;
		if(undefined != config.content) ConfigTemp.content	= config.content;
		if(undefined != config.doct) 	ConfigTemp.doct		= config.doct;
		return ConfigTemp;
	},
	
	Open : function (config)
	{
		var OpenConfig = this.GetConfig(config);
		var view = this.getView(OpenConfig.doct);
		if(OpenConfig.height > view.height)
			OpenConfig.height = view.height - 100;
		if(OpenConfig.width > view.width)
			OpenConfig.width = view.width - 100;
		
		var dlg_bg = OpenConfig.doct.createElement("div");
		dlg_bg.id = "dlg_bg";
		var dlg_view = OpenConfig.doct.createElement("div");
		dlg_view.id = "dlg_view";
		
		var dlg_main = OpenConfig.doct.createElement("div");
		dlg_main.id = "dlg_main";
		dlg_main.style.width = OpenConfig.width + "px";
		dlg_main.style.height = OpenConfig.height + "px";
		dlg_main.style.left = (view.width - OpenConfig.width) / 2 + "px";
		dlg_main.style.top = (view.height - OpenConfig.height)/ 2 + "px";
		var dlg_title = OpenConfig.doct.createElement("div");
		dlg_title.id = "dlg_title";
		var dlg_text = OpenConfig.doct.createElement("h4");
		dlg_text.id = "dlg_title";
		var dlg_close = OpenConfig.doct.createElement("span");
		dlg_close.id = "dlg_close";
		var dlg_box = OpenConfig.doct.createElement("div");
		dlg_box.id = "dlg_content";
		
		var dlg_resize = OpenConfig.doct.createElement("div");
		dlg_resize.id = "dlg_resize";

		dlg_close.onclick = this.Close;
		
		var dlg_content;
		var type = OpenConfig.type;
		content = OpenConfig.content;
		switch(type)
		{
		case "iframe":
			dlg_content = OpenConfig.doct.createElement("iframe");
			dlg_content.src = content;
			dlg_content.width = "100%";
			dlg_content.height = (OpenConfig.height - 30) + "px";
			dlg_content.scrolling = "auto";
			dlg_content.frameborder = "0";
			dlg_content.style.border = "0";
			dlg_content.marginheight = "0";
			dlg_content.marginwidth = "0";
			break;
		case "text":
			dlg_content = OpenConfig.doct.createTextNode(content);
			break;
		case "id":
			dlg_content = OpenConfig.doct.getElementById(content).cloneNode(true);
			dlg_content.id = "dlg_box";
			break;
		}
		
				
		var move = false;
		window.onmouseout = window.onmouseup = OpenConfig.doct.onmouseout = OpenConfig.doct.onmouseup = function(){move = false;}
		dlg_title.onmousedown = function(ev)
		{
			move = true;
			var mc = Dialogor.mouseCoords(ev);
			var mx = mc.x;
			var my = mc.y;
			dlg_title.onmouseout =  dlg_title.onmouseup = function(ev){ move = false; }
			dlg_title.onmousemove = function(ev){
				ev = ev || window.event; 
				var mc = Dialogor.mouseCoords(ev);
				if(move){
					var x = mc.x - mx;	
					var y = mc.y - my;	
					dlg_main.style.left = parseInt(dlg_main.style.left) + x + "px";
					dlg_main.style.top  = parseInt(dlg_main.style.top)  + y + "px";
				}
				mx = mc.x;
				my = mc.y;
				return false;
			}
		}
		
		dlg_resize.onmousedown = function(ev)
		{
			move = true;
			var mc = Dialogor.mouseCoords(ev);
			var mx = mc.x;
			var my = mc.y;
			dlg_resize.onmouseout =  dlg_resize.onmouseup = function(ev){ move = false; }
			dlg_resize.onmousemove = function(ev){
				ev = ev || window.event; 
				var mc = Dialogor.mouseCoords(ev);
				if(move){
					var x = mc.x - mx;	
					var y = mc.y - my;	
					if("iframe" == type)
					{
						dlg_content.height = (parseInt(dlg_main.style.width) + x - 30) + "px";
					}
					dlg_main.style.width = parseInt(dlg_main.style.width) + x + "px";
					dlg_main.style.height  = parseInt(dlg_main.style.height)  + y + "px";
				}
				mx = mc.x;
				my = mc.y;
				return false;
			}
		}
		
		dlg_text.appendChild(OpenConfig.doct.createTextNode(OpenConfig.title));
		dlg_close.appendChild(OpenConfig.doct.createTextNode("×"));
		dlg_title.appendChild(dlg_text);
		dlg_title.appendChild(dlg_close);
		dlg_box.appendChild(dlg_content);
		dlg_box.appendChild(dlg_resize);
		dlg_main.appendChild(dlg_title);
		dlg_main.appendChild(dlg_box);
		dlg_view.appendChild(dlg_main);
		OpenConfig.doct.body.appendChild(dlg_bg);
		OpenConfig.doct.body.appendChild(dlg_view);
		
		dlg_content.contentWindow.Dialogor = window.Dialogor;
		dlg_content.contentWindow.Dialogor.Config.doct = dlg_content.contentWindow.document;

		return false;
	},
	
	Close : function()
	{
		var dlg_view = Dialogor.Config.doct.getElementById("dlg_view");
		var dlg_bg = Dialogor.Config.doct.getElementById("dlg_bg");
		if(dlg_view) dlg_view.parentNode.removeChild(dlg_view); 
		if(dlg_bg) dlg_bg.parentNode.removeChild(dlg_bg); 
		return false;
	},
	
	CloseDoct : function(doct)
	{
		var dlg_view = doct.getElementById("dlg_view");
		var dlg_bg = doct.getElementById("dlg_bg");
		if(dlg_view) dlg_view.parentNode.removeChild(dlg_view); 
		if(dlg_bg) dlg_bg.parentNode.removeChild(dlg_bg); 
		return false;
	},
	
	CloseParent : function()
	{
		if(parent) Dialogor.CloseDoct(parent.document);
	},
	
	OpenParent : function (config)
	{
		if(!parent) return false;
		config.doct = parent.document;
		parent.Dialogor = window.Dialogor;
		parent.Dialogor.Config.doct = parent.document;
		return parent.Dialogor.Open(config);
	},

	getDataset : function (attributes) {  
		if (!attributes) return;  
		var hash = {};  
		  
		for (var attribute, i = 0, j = attributes.length; i < j; i++) {  
			attribute = attributes[i];  
			if(attribute.nodeName.indexOf('data-') != -1){  
				hash[attribute.nodeName.slice(5)] = attribute.nodeValue;  
			}  
		}  
		  
		return hash;  
	},
	
	getView : function (element)
	{
		if(element != this.Config.doct)
			return {
				width: element.offsetWidth,
				height: element.offsetHeight
			}
		if (this.Config.doct.compatMode == "BackCompat"){
			return {
				width: this.Config.doct.body.clientWidth,
				height: this.Config.doct.body.clientHeight
			}
		} else {
			return {
				width: this.Config.doct.documentElement.clientWidth,
				height: this.Config.doct.documentElement.clientHeight
			}
		}
	},
	
	//获取鼠标坐标
	mouseCoords : function (ev) 
	{ 
		if(ev.pageX || ev.pageY){ 
			return {x:ev.pageX, y:ev.pageY}; 
		} 
		return { 
			x:ev.clientX + this.Config.doct.body.scrollLeft - this.Config.doct.body.clientLeft, 
			y:ev.clientY + this.Config.doct.body.scrollTop - this.Config.doct.body.clientTop 
		};
	} 
}
