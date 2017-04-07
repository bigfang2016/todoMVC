(function() {

    var todos = [
        { title: "完成", completed: true, id: 1491397774925 },
        { title: "aaaaa完成", completed: false, id: 1491397785266 }
    ];

    var tab = [
        {hash: '', text: 'All', completed: undefined, selected: true},
        {hash: 'active', text: 'Active', completed: false, selected: false},
        {hash: 'completed', text: 'Completed', completed: true, selected: false}
    ];

    var M = {
        add: function(title) {

            var item = {
                title: title,
                completed: false,
                id: +new Date()
            };

            todos.push(item);

        },

        del: function(id) {

            for (var i = 0; i < todos.length; i++) {
                if (todos[i].id == id) {
                    todos.splice(i, 1);
                }
            }

        },

        toggle: function(id) {

            for (var i = 0; i < todos.length; i++) {
                if (todos[i].id == id) {
                    todos[i].completed = !todos[i].completed;
                }
            }

        },

        get: function(completed) {

            if (completed === undefined) {
                return todos;
            } else {

                var ret = [];

                for (var i = 0; i < todos.length; i++) {
                    if (todos[i].completed === completed) {
                        ret.push(todos[i]);
                    }
                }

                return ret;

            }

        },

        clear: function(){
          var ret = [];
          for(var i=0; i<todos.length; i++){
            if(todos[i].completed !== true){
              ret.push( todos[i] );
            }
          }
          
          todos = ret;

        }

    };

    var V = {

        template: function(obj) {

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

        render: function() {

            var completed;

            for(let i=0; i<tab.length; i++){
              if(tab[i].selected){
                completed = tab[i].completed;
                break;
              }
            }

            var data = M.get(completed);

            var block = '';
            for (let i = 0; i < data.length; i++) {
                block += V.template(data[i]);
            }

            document.querySelector('.todo-list').innerHTML = block;

        },

        tabRender: function(){

          var block = '';
          for(var i=0; i<tab.length; i++){

            var href = '#/' + tab[i].hash;
            var selected = (tab[i].selected) ? 'selected' : '';
            var text = tab[i].text;

            block += `<li>
                        <a href="${href}" class="${selected}">${text}</a>
                      </li>`;
          }

          document.querySelector('.filters').innerHTML = block;

        }

    };

    var C = {

        enter: function(e) {
            if (e.keyCode !== 13) {
                return false;
            }
            var ele = e.target;
            if (!ele.value) {
                return false;
            }
            M.add(ele.value);
            ele.value = '';
            V.render();
        },

        dispatch: function(e) {

            var ele = e.target;
            var id = ele.parentNode.parentNode.dataset.id;

            var action = ele.classList.value;
            switch (action) {
                case 'toggle':
                    C.toggleItem(id);
                    break;
                case 'destroy':
                    C.destroyItem(id);
                    break;
            }

        },

        toggleItem: function(id) {
            M.toggle(id);
            V.render();
        },

        destroyItem: function(id) {
            M.del(id);
            V.render();
        },

        tab: function(e) {

            var hash = window.location.hash;
            
            for(var i=0; i<tab.length; i++){
              tab[i].selected = ( '#/' + tab[i].hash === hash ) ? true : false;
            }
            
            V.tabRender();
            V.render();

        },

        clear: function(){
          M.clear();
          V.render();
        }

    };

    function setup() {

        C.tab();
        V.render();

        //
        var todo_list = document.querySelector('.todo-list');
        todo_list.addEventListener('click', C.dispatch);

        //
        var new_todo = document.querySelector('.new-todo');
        new_todo.addEventListener('keypress', C.enter);

        window.addEventListener('hashchange', C.tab);

        var clear_completed = document.querySelector('.clear-completed');
        clear_completed.addEventListener('click', C.clear);

    }

    setup();



})();
