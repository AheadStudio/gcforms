class GCForm {
	constructor(params) {
		this.form = document.createElement("form", {
			action: "/"
		});
		this.form.setAttribute("class", "gcform");
		
		this.holder = params.holder;
		this.settings = this.holder.dataset;
		this.fields = this.getFields();
		
		this.getUTM();
		this.generate();
		
		this.publish();
		
	}
	
	getUTM() {
		var query = location.search;
		if(!query) {
			return false;
		}
		query = query.replace(/\?/gi, "");
		
		var queryItems = query.split("&"),
			queryItem = false;
		for(var i = 0, len = queryItems.length; i < len; i++) {
			queryItem = queryItems[i].split("=");
			if(queryItem[0].indexOf("utm") != -1) {
				this.fields.unshift({
					name: queryItem[0],
					type: "hidden",
					value: queryItem[1]
				});
			}
		}
		//console.log(this.fields);
	}
	
	getFields() {
		return [
			{
				name: "n1",
				type: "text",
				placeholder: "Input your name",
				required: false,
				value: ""
			}, {
				name: "n2",
				type: "email",
				placeholder: "input your email",
				required: true,
				value: ""
			}	
		];
	}
	
	generate() {
		//console.log(this.fields);
		this.addTitle();
		for(var i = 0, len = this.fields.length; i < len; i++) {
			this.addField(this.fields[i]);
		}
		this.addSubmit();
		
		if(this.settings.gcformsPopup) {
			this.form.classList.add("popup");
			
			var popupBtn = document.createElement("a");
			popupBtn.setAttribute("href", "#");
			popupBtn.classList.add("gcform-open");
			popupBtn.textContent = "Open form";
			
			this.holder.appendChild(popupBtn);
			
			var self = this;
			popupBtn.addEventListener("click", function(e) {
				self.form.classList.toggle("popup");
				e.preventDefault();
			});
		}
	}
	
	publish() {
		this.holder.appendChild(this.form);
	}
	
	addField(fieldParams) {
		var field = null;
		
		// Field builder
		switch(fieldParams.type) {
			case "email":
			case "hidden":
				field = document.createElement("input");
			break;
			default:
				field = document.createElement("input");
			break;
		}
		field.setAttribute("class", "gcform-item");
		field.setAttribute("type", fieldParams.type);
		field.setAttribute("name", fieldParams.name);
		field.setAttribute("id", "gc_" + fieldParams.name);
		if(fieldParams.required) {
			field.setAttribute("required", "required");
		}
		if(fieldParams.placeholder) {
			field.setAttribute("placeholder", fieldParams.placeholder);
		}
		if(fieldParams.value) {
			field.value = fieldParams.value;
		}
		
		if(fieldParams.type != "hidden") {
			// Add holder for the field
			var holder = document.createElement("div");
			holder.setAttribute("class", "gcform-item-holder");
			
			// Add label for the field
			var label = document.createElement("label");
			label.setAttribute("for", "gc_" + fieldParams.name);
			label.setAttribute("class", "gcform-item-label");
			label.appendChild(document.createTextNode(fieldParams.placeholder));
			
			holder.appendChild(label);
			holder.appendChild(field);
			
			// Events
			(function(self, holder, field, label) {
				self.addEvents(holder, field, label);
			})(this, holder, field, label);
			
			// Append to the form
			this.form.appendChild(holder);
		} else {
			this.form.appendChild(field);
		}
		

	}
	
	addEvents(holder, field, label) {
		field.addEventListener("focus", function() {
			holder.classList.add("entered");
		});
		field.addEventListener("blur", function() {
			holder.classList.remove("entered");
		});		
	}
	
	addSubmit() {
		var submit = document.createElement("button");
		submit.setAttribute("type", "submit");
		submit.setAttribute("class", "gcform-submit");
		submit.textContent = "Send";
		this.form.appendChild(submit);
	}
	
	addTitle() {
		var title = document.createElement("div");
		title.setAttribute("class", "gcform-title");
		title.textContent = this.settings.gcformsTitle;
		this.form.appendChild(title);
	}
}

class GCFormHelpers {
	// Обходчик всех форм
	static walk() {
		var forms = document.querySelectorAll(".gcform"),
			form = false;
		for(var i = 0, len = forms.length; i < len; i++) {
			form = forms[i];
			new GCForm({
				holder: form
			});
		}
	}
	static addCSS() {
		var link = document.createElement("link");
		link.setAttribute("type", "text/css");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", "/gcforms/data/styles.css");
		document.head.appendChild(link);
	}
}

document.addEventListener("DOMContentLoaded", function(e) {
	GCFormHelpers.addCSS();
	GCFormHelpers.walk();
});