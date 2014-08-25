/**
 * Created by Tsuyoshi on 2014/08/25.
 */
var app = app || {};

// AppViewはアプリケーション全体のUIを表します
app.AppView = Backbone.View.extend({

    // スケルトンの要素としては、新規作成するのではなくすでにHTMLの中に
    // 存在しているものを利用します
    el: '#todoapp',

    // 画面下端に表示される、統計情報のためのテンプレート
    statsTemplate: _.template($('#stats-template').html()),

    // 項目の新規作成と、完了した項目の消去に対応するイベント。委譲を // 受けています
    events: {
        'keypress #new-todo'    : 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all'     : 'toggleAllComplete'
    },

    // Todosコレクション上での項目の追加や削除に反応するために、
    // 初期化処理の中でイベントリスナーを登録します
    initialize: function() {
        this.allCheckbox = this.$('#toggle-all');
        this.$input      = this.$('#new-todo');
        this.$footer     = this.$('#footer');
        this.$main       = this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);
        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);

        app.Todos.fetch();
    },

    // ここでは統計情報だけが更新され、他の部分は変化しません
    render: function() {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;
        if (app.Todos.length) {
            this.$main.show();
            this.$footer.show();
            this.$footer.html(
                this.statsTemplate({
                    completed: completed,
                    remaining: remaining
                })
            );
            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + (app.TodoFilter || '') + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    // 指定されたTodo項目のためのビューを作成し、
    // <ul>要素の直下に挿入します
    addOne: function(todo) {
        var view = new app.TodoView({ model: todo });
        $('#todo-list').append(view.render().el);
    },

    // コレクションに含まれているTodo項目をすべて追加します
    addAll: function() {
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    filterOne: function(todo) {
        todo.trigger('visible');
    },

    filterAll: function() {
        app.Todos.each(this.filterOne, this);
    },

    // 新規作成されるTodo項目のために、属性のリストを生成します
    newAttributes: function() {
        return {
            title    : this.$input.val().trim(),
            order    : app.Todos.nextOrder(),
            completed: false
        };
    },

    // 入力フィールドでEnterキーが押されると、Todoのモデルを作成して
    // localStorageに永続化します
    createOnEnter: function(event) {
        if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
            return;
        }

        app.Todos.create( this.newAttributes() );
        this.$input.val('');
    },

    // 完了したTodo項目をすべて消去し、モデルを破棄します
    clearCompleted: function() {
        _.invoke(app.Todos.completed(), 'destroy');

        return false;
    },

    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;
        app.Todos.each(function(todo) {
            todo.save({
                'completed': completed
            });
        });
    }
});