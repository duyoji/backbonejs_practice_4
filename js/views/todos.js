/**
 * Created by Tsuyoshi on 2014/08/25.
 */
var app = app || {};

// Todo項目を表すDOMの要素
app.TodoView = Backbone.View.extend({

    // タグ名はliです
    tagName: 'li',

    // 項目のテンプレートのための関数をキャッシュします
    template: _.template($('#item-template').html()),

    // 項目に固有のDOMイベント
    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit'    : 'close'
    },

    // モデルに対する変化を監視して再描画を行います。
    // TodoとTodoViewは1対1で対応しているため、ここではモデルを直接参照しています
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    // 項目のタイトルを再描画します
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$('.edit');

        return this;
    },

    // 編集モードに移行し、入力フィールドを表示します
    edit: function() {
        this.$el.addClass('editing');
        this.$input.focus();
    },

    // 編集モードを終了し、Todo項目を保存します
    close: function() {
        var value = this.$input.val().trim();
        if (value) {
            this.model.save({ title: value });
        }
        this.$el.removeClass('editing');
    },

    // Enterキーが押されると編集モードを終了します
    updateOnEnter: function(e) {
        if (e.which === ENTER_KEY) {
            this.close();
        }
    }
});