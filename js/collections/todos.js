/**
 * Created by Tsuyoshi on 2014/08/25.
 */

var app = app || {};


var TodoList = Backbone.Collection.extend({
    model: app.Todo,

    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // 完了済みのTodo項目だけをフィルタリングして返します
    completed: function() {
        return this.filter(function(todo) {
            return todo.get('completed');
        });
    },

    // 未了のTodo項目だけをフィルタリングして返します
    remaining: function() {
        // applyを使うことによって、関数内でthisが指すコンテキストを
        // 指定できます
        return this.without.apply(this, this.completed());
    },

    // Todo項目は作成順に管理したいのですが、データベース内では順不同の
    // GUIDを使って管理されています。次に作成されるTodo項目の連番を
    // 返します
    nextOrder: function() {
        if (!this.length) {
            return 1;
        }

        return this.last().get('order') + 1;
    },

    // Todo項目を作成順にソートします
    comparator: function(todo) {
        return todo.get('order');
    }
});

// コレクションをグローバルに作成します
app.Todos = new TodoList();