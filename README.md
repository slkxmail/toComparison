<script>
    $(document).ready(function() {
        toComparison.init({
            comparisonUrl:'/kasko/sravnenie/'
        });
    });
</script>

<div class="kaskoTariffList_action">
    <a href="{{ path('acme_default_kasko_tariff_item', {'tariffPath': tariff.titleCanonical }) }}" class="btn btn-default">Подробнее</a>
    <a href="#" data-compare="true" data-title="{{ tariff.title }}" data-id="{{ tariff.id }}" {# onclick="return toComparison.toComparison({{ tariff.id }}, '{{ tariff.title }}');"#} class="btn btn-info">Сравнить</a>
</div>
