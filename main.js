(function(){
	var todos = [
    	{ "title": "完成", "completed": true, "id": 1491397774925 }, 
    	{ "title": "未完成", "completed": false, "id": 1491397785266 } 
	];
	var tab = [
		{ hash: 'all', selected: true },
		{ hash: 'active', selected: false },
		{ hash: 'completed', selected: false }
	];
	var M = {
		add: function(title){
			var item = {
				title: title,
				completed: false,
				id: +new Date()
			};
			todos.push(item);
			console.log(item);
		},
		del: function(id){
			for(let i = 0; i < todos.length; i++){
				if ( todos[i].id == id ){
					todos.splice(i, 1);//从第 i 位开始删除 1 个元素
				}
			}
			console.log(todos);
		},
		toggle: function(id){
			for(var i = 0; i < todos.length; i++){
				if (todos[i].id == id) {
					todos[i].completed = !todos[i].completed;
				}
			}
			console.log(todos);
		},
		get: function(completed){
			if (completed === undefined) {
				return todos;
			}else{
				var ret = [];
				for (var i = 0; i < todos.length; i++) {
					if(todos[i].completed === completed){
						ret.push( todos[i]);
					}
				}
				return ret;
			}
		}
	};

	var V = {
		template: function(obj){
			var id = obj.id;
			var completed = (obj.completed) ? 'completed' : '';
			var checked = (obj.completed) ? 'checked' : '';
			var title = obj.title;

			return `<li data-id="${id}" class="${completed}">
                    <div class="view">
                        <input class="toggle" type="checkbox" ${checked}>
                        <label>${title}</label>
                        <button class="destroy"></button>
                    </div>
                </li>`;

		},

        filters: function() {
            var selected = document.querySelector('.filters .selected');
            var text = selected.textContent.toLowerCase();
            switch (text) {
                case 'all':
                    return M.get();
                case 'active':
                    return M.get(false);
                case 'completed':
                    return M.get(true)
            }
        },		

		render: function(data){
			var block = '';
			for (var i = 0; i < data.length; i++) {
				block += V.template(data[i]);
			}

			document.querySelector('.todo-list').innerHTML = block;
		}
	};
	var C = {
		keypress: function(e){
			// console.log('d');
			if (e.keyCode !== 13) {
				return false;
			}
			var ele = e.target;
			if (!ele.value) {
				return false;
			}
			M.add(ele.value);
			ele.value = '';
			V.render( todos );
		},
		dispatch: function(e){
			var ele = e.target;
			var id = ele.parentNode.parentNode.dataset.id;
			var action = ele.classList.value;
			// console.log(action);
			switch(action){
				case 'toggle':
					// console.log('你点击了多选框');
					C.toggleItem(id);
					break;
				case 'destroy':
					// console.log('你点击了删除按钮🔘');
					C.destroyItem(id);
					break;
			}
		},
		toggleItem: function(id){
			M.toggle(id);
			// V.render(todos);
			V.render(V.filters());
		},
		destroyItem: function(id){
			M.del(id);
			// V.render(todos);
			V.render(V.filters());
		}
	};

	function setup(){
		// M.add('随便起个标题');
		// M.add('再随便起个标题');
		// // M.del('1491397785266');
		// // M.toggle('1491397785266');

		// // var ret = M.get(false);
		// var ret = V.render( [ todos[0] ]);
		// console.log(ret);
		V.render(todos);
		document.querySelector('.new-todo').addEventListener('keypress',C.keypress);
		document.querySelector('.todo-list').addEventListener('click', C.dispatch);	
		
		V.filters();
		V.render(V.filters());

	}

	setup();

})();