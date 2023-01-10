new Vue({
    el: "#app",

    data: {
        items: [],
        newItemText: "",
        isNewItemInvalid: false,
        itemId: 1
    },

    methods: {
        addItem: function () {
            var value = this.newItemText.trim();
            this.isNewItemInvalid = value.length === 0;

            if (this.isNewItemInvalid) {
                return;
            }

            this.items.push({
                id: this.itemId,
                text: value,
                isEditing: false,
                isInvalid: false,
                editText: ""
            });

            this.itemId++;
            this.newItemText = "";
        },

        deleteItem: function (itemIndex) {
            this.items.splice(itemIndex, 1);
        },

        editItem: function (item) {
            item.editText = item.text;
            item.isEditing = true;
        },

        saveItem: function (item) {
            var value = item.editText.trim();
            item.isInvalid = value.length === 0;

            if (item.isInvalid) {
                return;
            }

            item.text = value;
            item.isEditing = false;
        },

        cancelEditing: function (item) {
            item.isInvalid = false;
            item.isEditing = false;
        }
    }
});