toComparison = {
    settings: {
        debug: true
        ,cookieParamName: 'compareData'
        ,comparisonPanelId: 'comparePanelId'
        ,comparisonPanelTitle: 'Сравнение тарифов:'
        ,comparisonUrl: '/sravnenie/'
    }
    , showDebugLog: function (logStr, obj) {
        var selfObj = this;
        if(logStr) {
            if (selfObj.settings.debug) {
                console.log('toComparison: ' + logStr);
            }
        }

        if(obj) {
            console.log('toComparison: ');
            console.log(obj);
        }
    }

    ,init: function (settingsList) {
        var selfObj = this;
        selfObj.showDebugLog('Start init');
        if (settingsList != undefined) {
            selfObj.settings = $.extend(selfObj.settings, settingsList);
        }
        var data = selfObj.getDataForCookie();
        selfObj.showDebugLog('Data for cookie');
        console.log(data);

        $("[data-compare='true']").on('click', function(event){
            selfObj.clickToComparison($(this).attr('data-id'));
            event.stopPropagation();
            event.preventDefault();
        });

        $("[data-compare='true']").each(function(){
            selfObj.markButtonAsCompare($(this).attr('data-id'));
        //    $(this).addClass('text-danger');
        });

        // Показать панель вверху экрана с предложение перейти на страницу сравнения
        selfObj.showComparisonPanel();

        $("#"+selfObj.settings.comparisonPanelId+" .comparisonPanelClose").on('click', function(event){
            //selfObj.clickToComparison($(this).attr('data-id'));
            $("#"+selfObj.settings.comparisonPanelId).remove();
            event.stopPropagation();
            event.preventDefault();
        });
    }

    ,markButtonAsCompare: function(id) {
        var selfObj = this;

        if(selfObj.checkById(id)) {
            selfObj.showDebugLog('Поменить кнопку "Добавлен к сравнению"');
            $("[data-compare='true'][data-id='" + id + "']").html('Добавлен к сравнению');
        } else {
            selfObj.showDebugLog('Поменить кнопку "Сравнить"');
            $("[data-compare='true'][data-id='" + id + "']").html('Сравнить');
        }
    }

    ,clickToComparison: function(id, event) {
        var selfObj = this;
        selfObj.showDebugLog('Клинкули на кнопку сравнить');

        // Проверить если объект уже добавлен к сравнению то:
        if(selfObj.checkById(id)) {
            selfObj.showDebugLog('Нужно удалить из сравнения');
            // Убрать из сравнени
            selfObj.deleteFromComparison(id);

        } else {
            selfObj.showDebugLog('Нужно добавить к сравнению');
            // Добавить к сравнению
            selfObj.toComparison(id, $("[data-compare='true'][data-id='" + id + "']").attr('data-title'));
        }

        // Показать панель вверху экрана с предложение перейти на страницу сравнения
        selfObj.showComparisonPanel();
        return false;
    }

    ,showComparisonPanel: function() {
        var selfObj = this;
        selfObj.showDebugLog('Start showComparisonPanel');
        var data = selfObj.getDataForCookie();

        // Если для сравнения мало элеменотов
        if(data.length < 2) {
            selfObj.showDebugLog('Количество объектов недостаточное для сравнения');

            // Удалить панель
            $("#"+selfObj.settings.comparisonPanelId+" .comparisonPanelClose").on('click', function(event){
                $("#"+selfObj.settings.comparisonPanelId).remove();
            });
            return true;
        }

        var urlIdsPart = '';
        var separator = '';
        data.forEach(function(item){
            urlIdsPart += separator + item.id;
            separator = ',';
        });

        var comparisonUrl = selfObj.settings.comparisonUrl + urlIdsPart;
        if($('#' + selfObj.settings.comparisonPanelId).html() != undefined) {
            var text = $('#' + selfObj.settings.comparisonPanelId);
        } else {
            var text = '<div id="' + selfObj.settings.comparisonPanelId + '" class="comparisonPanel">' +
                '<div class="comparisonPanelTitle">' + selfObj.settings.comparisonPanelTitle + ' Всего в списке к сравнению <span class="elementCount">2</span> элемента' +
                '<a href="#" class="btn btn-default btn-xs comparisonActionBth">Сравнить</a>' +
                '<button class="md-close close comparisonPanelClose text-right">×</button>' +
                '</div>' +
                '</div>';

            $(text).appendTo('body');
            $(text).height('100');
            $(text).width($(window).width());
        }

        $('#' + selfObj.settings.comparisonPanelId + ' .elementCount').html(data.length);
        $('#' + selfObj.settings.comparisonPanelId + ' .comparisonActionBth').attr('href', comparisonUrl);
    }
    ,getDataForCookie: function(){
        var selfObj = this;

        selfObj.showDebugLog('Start getDataForCookie');
        var paramsJsonStr = $.cookie(selfObj.settings.cookieParamName);
        if(paramsJsonStr) {
            return paramsSaved = JSON.parse(paramsJsonStr);
        } else {
            return [];
        }
    }
    ,setDataToCookie: function(paramsSaved){
        var selfObj = this;

        selfObj.showDebugLog('Start setDataToCookie');
        selfObj.showDebugLog(null, paramsSaved);

        var paramsStr = JSON.stringify(paramsSaved);
        $.cookie(selfObj.settings.cookieParamName, paramsStr);
    }

    ,toComparison: function(pathId, title){
        var selfObj = this;
        selfObj.showDebugLog('Start toComparison');

        var paramsSaved = selfObj.addToData(pathId, title);
        selfObj.setDataToCookie(paramsSaved);

        // Обновить нажатую кнопку
        selfObj.markButtonAsCompare(pathId);

        return false;
    }

    // Проверить есть ли объект с указаным ID
    ,checkById: function(pathId) {
        var selfObj = this;
        var data = selfObj.getDataForCookie();
        selfObj.showDebugLog('Start checkById');

        // проверить есть ли такие данные в data
        var isExists = false;
        data.forEach(function(item){
            if(item.id == pathId) {
                isExists = true;
            }
        });

        return isExists;
    }

    // Добавить в хранилище
    ,addToData: function(pathId, title) {
        var selfObj = this;
        var data = selfObj.getDataForCookie();
        selfObj.showDebugLog('Start addToData');

        // проверить есть ли такие данные в data
        var isExists = false;
        data.forEach(function(item){
            if(item.id == pathId) {
                isExists = true;
            }
        });

        // если данных нет, добавить
        if(!isExists) {
            var operObj = {id:pathId, title:title};
            data.push(operObj);
        }
        // если данные есть пропустить

        return data;
    }

    // Удалить значение по ключу
    ,deleteFromComparison: function(pathId){
        var selfObj = this;
        var data = selfObj.getDataForCookie();
        selfObj.showDebugLog('Start deleteFromComparison');
        var newData = [];

        // Если такой ID есть в данных удалить
        data.forEach(function(item){
            if(item.id != pathId) {
                newData.push(item);
            }
        });

        selfObj.setDataToCookie(newData);

        // Обновить нажатую кнопку
        selfObj.markButtonAsCompare(pathId);

        return false;
    }
};
