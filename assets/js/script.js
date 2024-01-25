$(function() {
    initializeSelect2('tags-unique',[{id: 1, text: 'teste'}, {id: 2, text: 'teste2'}], 20, 'select-value-unique', false);
    initializeSelect2('tags-multiple',[{id: 1, text: 'test3'}, {id: 2, text: 'teste4'}], 20, 'select-value-multiple', true);
    
    function initializeSelect2(inputId, tags, maximumInputLength, valueSelected, allowMultipleTags, selectedValues) {
        var select2Options = {
            tags: tags,
            maximumInputLength: maximumInputLength,
            createSearchChoice: function(term, data) {
                term = term.trim();
                if (term !== '') {
                    const existingTags = data.map(function(item) {
                      return item.text.toLowerCase();
                    });

                    // Cria a nova tag se ela não existir
                    if (existingTags.indexOf(term.toLowerCase()) === -1) {
                      return { id: term, text: term };
                    }
                }
            },
        };

        //Executa a função para atualizar os valores selecionados sempre que houver uma mudança
        $("#" + inputId).select2(select2Options).on("change", function() {
            updateSelectedValues();
        });

        //Impedir a remoção de valores através do input
        $("#" + inputId).on("select2-removing", function(e) {
            e.preventDefault();
            return false;
        });

        // Função para atualizar os valores selecionados
        function updateSelectedValues() {
            const selectedData = $("#" + inputId).select2("data");
            renderSelectedValues(selectedData);
        }

        // Função para renderizar os valores selecionados na interface
        function renderSelectedValues(data) {
            $("#" + inputId).on("select2-selecting", function(event) {
                var selectValues = $("#" + inputId).val();
                /**
                 * Se allowMultipleTags for true pode selecionar mais de um valor
                 * Se allowMultipleTags for false pode selecionar apenas um valor
                 */
                if (!allowMultipleTags && selectValues.length >= 1) {
                    event.preventDefault();// Impede a seleção se já houver um valor selecionado
                    $("#" + inputId).select2('close');//fecha o select2

                    alert('Apenas é possivel selecionar um valor!');
                }
            });

            // Limpa a div existente
            $('#' + valueSelected).empty();

            // Cria uma div para cada valor selecionado do select2
            data.forEach(function(item) {
                const div   = $('<div>').addClass('selected-value');
                const icon  = $('<i>').addClass('search-remove-bt icon icon-cancelado');
                const span  = $('<span>').text(item.text);

                // Adiciona o atributo data-id com o valor do ID no span
                span.attr('data-id', item.id);
                div.append(icon);
                div.append(span);

                $('#' + valueSelected).append(div);
            });

            // Oculta os valores selecionados no input do Select2
            $(".select2-search-choice").css("display", "none");

            // Adiciona um evento de clique para o ícone "x" capaz de remover o valor selecionado
            $('.search-remove-bt').on('click', function() {
                const textToRemove = $(this).next().text();
                const selectedData = $("#" + inputId).select2("data");
                const itemToRemove = selectedData.find(item => item.text === textToRemove);

                if (itemToRemove) {
                  const index = selectedData.indexOf(itemToRemove);

                  if (index > -1) {
                    selectedData.splice(index, 1);
                  }

                  $("#" + inputId).select2("data", selectedData);
                  $("#" + inputId).trigger('change');
                }

                $(this).parent().remove();
            });
        }

        // Se houver valores pré-selecionados, define-os no Select2
        if (selectedValues && selectedValues.length > 0) {
            $("#" + inputId).select2("data", selectedValues);
        }

        // Atualiza os valores selecionados quando a página carregar
        updateSelectedValues();
    }
});