/**
 * Created by Tsuyoshi on 2014/08/25.
 */

// Todoのルーター -----------

var Workspace = Backbone.Router.extend({
    routes:{
        '*filter': 'setFilter'
    },

    setFilter: function(param) {
        // 適用するべきフィルタをセットします
        app.TodoFilter = param || '';
        // コレクションのfilterイベントを発生させ、Todo項目の表示と
        // 非表示を切り替えます
        window.app.Todos.trigger('filter');
    }
});

app.TodoRouter = new Workspace();
Backbone.history.start();