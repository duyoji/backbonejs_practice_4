/**
 * Created by Tsuyoshi on 2014/08/25.
 */
var app = app || {};

// Todo項目を表すモデルには、titleとcompletedそしてorder(後述)
// という3つの属性が含まれます
app.Todo = Backbone.Model.extend({

    // デフォルト値を用意することによって、すべてのTodo項目にそれぞれの
    // 属性が存在することを保証します
    defaults: {
        title: '',
        completed: false
    },

    // completed属性の値をトグルします
    toggle: function() {
        this.save({
            completed: !this.get('completed')
        });
    }
});