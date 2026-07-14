import type { ThemeRegistrationRaw } from "shiki";

export default {
  semanticHighlighting: true,
  semanticTokenColors: {
    customLiteral: "var(--shiki-function)",
    newOperator: "var(--shiki-operator)",
    numberLiteral: "var(--shiki-number)",
    stringLiteral: "var(--shiki-string)",
  },
  settings: [
    {
      scope: [
        "meta.embedded",
        "source.groovy.embedded",
        "string meta.image.inline.markdown",
        "variable.legacy.builtin.python",
      ],
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: "emphasis",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "strong",
      settings: {
        fontStyle: "bold",
      },
    },
    {
      scope: "header",
      settings: {
        foreground: "var(--shiki-header)",
      },
    },
    {
      scope: "comment",
      settings: {
        foreground: "var(--shiki-comment)",
      },
    },
    {
      scope: "constant.language",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: [
        "constant.numeric",
        "variable.other.enummember",
        "keyword.operator.plus.exponent",
        "keyword.operator.minus.exponent",
      ],
      settings: {
        foreground: "var(--shiki-number)",
      },
    },
    {
      scope: "constant.regexp",
      settings: {
        foreground: "var(--shiki-regex-constant)",
      },
    },
    {
      scope: "entity.name.tag",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: ["entity.name.tag.css", "entity.name.tag.less"],
      settings: {
        foreground: "var(--shiki-tag)",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: [
        "entity.other.attribute-name.class.css",
        "source.css entity.other.attribute-name.class",
        "entity.other.attribute-name.id.css",
        "entity.other.attribute-name.parent-selector.css",
        "entity.other.attribute-name.parent.less",
        "source.css entity.other.attribute-name.pseudo-class",
        "entity.other.attribute-name.pseudo-element.css",
        "source.css.less entity.other.attribute-name.id",
        "entity.other.attribute-name.scss",
      ],
      settings: {
        foreground: "var(--shiki-tag)",
      },
    },
    {
      scope: "invalid",
      settings: {
        foreground: "var(--shiki-error)",
      },
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold",
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "markup.strikethrough",
      settings: {
        fontStyle: "strikethrough",
      },
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: "var(--shiki-number)",
      },
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "punctuation.definition.quote.begin.markdown",
      settings: {
        foreground: "var(--shiki-comment)",
      },
    },
    {
      scope: "punctuation.definition.list.begin.markdown",
      settings: {
        foreground: "var(--shiki-list-marker)",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "punctuation.definition.tag",
      settings: {
        foreground: "var(--shiki-punctuation)",
      },
    },
    {
      scope: ["meta.preprocessor", "entity.name.function.preprocessor"],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: "var(--shiki-number)",
      },
    },
    {
      scope: "meta.structure.dictionary.key.python",
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "storage",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: ["storage.modifier", "keyword.operator.noexcept"],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: ["string", "meta.embedded.assembly"],
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "string.tag",
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "string.value",
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: "var(--shiki-regex)",
      },
    },
    {
      scope: [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded",
      ],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: ["meta.template.expression"],
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: [
        "support.type.vendored.property-name",
        "support.type.property-name",
        "source.css variable",
        "source.coffee.embedded",
      ],
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: [
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.cast",
        "keyword.operator.sizeof",
        "keyword.operator.alignof",
        "keyword.operator.typeid",
        "keyword.operator.alignas",
        "keyword.operator.instanceof",
        "keyword.operator.logical.python",
        "keyword.operator.wordlike",
      ],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "var(--shiki-number)",
      },
    },
    {
      scope: [
        "punctuation.section.embedded.begin.php",
        "punctuation.section.embedded.end.php",
      ],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "support.function.git-rebase",
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: "constant.sha.git-rebase",
      settings: {
        foreground: "var(--shiki-number)",
      },
    },
    {
      scope: [
        "storage.modifier.import.java",
        "variable.language.wildcard.java",
        "storage.modifier.package.java",
      ],
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "support.constant.handlebars",
        "source.powershell variable.other.member",
        "entity.name.operator.custom-literal",
      ],
      settings: {
        foreground: "var(--shiki-function)",
      },
    },
    {
      scope: [
        "support.class",
        "support.type",
        "entity.name.type",
        "entity.name.namespace",
        "entity.other.attribute",
        "entity.name.scope-resolution",
        "entity.name.class",
        "storage.type.numeric.go",
        "storage.type.byte.go",
        "storage.type.boolean.go",
        "storage.type.string.go",
        "storage.type.uintptr.go",
        "storage.type.error.go",
        "storage.type.rune.go",
        "storage.type.cs",
        "storage.type.generic.cs",
        "storage.type.modifier.cs",
        "storage.type.variable.cs",
        "storage.type.annotation.java",
        "storage.type.generic.java",
        "storage.type.java",
        "storage.type.object.array.java",
        "storage.type.primitive.array.java",
        "storage.type.primitive.java",
        "storage.type.token.java",
        "storage.type.groovy",
        "storage.type.annotation.groovy",
        "storage.type.parameters.groovy",
        "storage.type.generic.groovy",
        "storage.type.object.array.groovy",
        "storage.type.primitive.array.groovy",
        "storage.type.primitive.groovy",
      ],
      settings: {
        foreground: "var(--shiki-type)",
      },
    },
    {
      scope: [
        "meta.type.cast.expr",
        "meta.type.new.expr",
        "support.constant.math",
        "support.constant.dom",
        "support.constant.json",
        "entity.other.inherited-class",
        "punctuation.separator.namespace.ruby",
      ],
      settings: {
        foreground: "var(--shiki-type)",
      },
    },
    {
      scope: [
        "keyword.control",
        "source.cpp keyword.operator.new",
        "keyword.operator.delete",
        "keyword.other.using",
        "keyword.other.directive.using",
        "keyword.other.operator",
        "entity.name.operator",
      ],
      settings: {
        foreground: "var(--shiki-operator)",
      },
    },
    {
      scope: [
        "variable",
        "meta.definition.variable.name",
        "support.variable",
        "entity.name.variable",
        "constant.other.placeholder",
      ],
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: ["variable.other.constant", "variable.other.enummember"],
      settings: {
        foreground: "var(--shiki-variable)",
      },
    },
    {
      scope: ["meta.object-literal.key"],
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: [
        "support.constant.property-value",
        "support.constant.font-name",
        "support.constant.media-type",
        "support.constant.media",
        "constant.other.color.rgb-value",
        "constant.other.rgb-value",
        "support.constant.color",
      ],
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: [
        "punctuation.definition.group.regexp",
        "punctuation.definition.group.assertion.regexp",
        "punctuation.definition.character-class.regexp",
        "punctuation.character.set.begin.regexp",
        "punctuation.character.set.end.regexp",
        "keyword.operator.negation.regexp",
        "support.other.parenthesis.regexp",
      ],
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: [
        "constant.character.character-class.regexp",
        "constant.other.character-class.set.regexp",
        "constant.other.character-class.regexp",
        "constant.character.set.regexp",
      ],
      settings: {
        foreground: "var(--shiki-regex)",
      },
    },
    {
      scope: ["keyword.operator.or.regexp", "keyword.control.anchor.regexp"],
      settings: {
        foreground: "var(--shiki-function)",
      },
    },
    {
      scope: "keyword.operator.quantifier.regexp",
      settings: {
        foreground: "var(--shiki-tag)",
      },
    },
    {
      scope: ["constant.character", "constant.other.option"],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "constant.character.escape",
      settings: {
        foreground: "var(--shiki-tag)",
      },
    },
    {
      scope: "entity.name.label",
      settings: {
        foreground: "var(--shiki-label)",
      },
    },

    // Go-specific scopes
    {
      scope: [
        "keyword.function.go",
        "keyword.package.go",
        "keyword.import.go",
        "keyword.struct.go",
        "keyword.interface.go",
        "keyword.map.go",
        "keyword.channel.go",
        "keyword.const.go",
        "keyword.var.go",
        "keyword.type.go",
        "keyword.control.import.go",
      ],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: [
        "constant.language.boolean.go",
        "constant.language.null.go",
        "constant.language.iota.go",
      ],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: "entity.name.function.support.builtin.go",
      settings: {
        foreground: "var(--shiki-builtin)",
      },
    },
    {
      scope: [
        "entity.name.type.go",
        "entity.name.type.package.go",
        "entity.name.type.any.go",
        "entity.name.type.comparable.go",
      ],
      settings: {
        foreground: "var(--shiki-type)",
      },
    },
    {
      scope: "variable.parameter.go",
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: "variable.other.constant.go",
      settings: {
        foreground: "var(--shiki-variable)",
      },
    },
    {
      scope: [
        "variable.other.go",
        "variable.other.assignment.go",
      ],
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: "variable.other.property.go",
      settings: {
        foreground: "var(--shiki-property)",
      },
    },
    {
      scope: "entity.name.import.go",
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: [
        "keyword.operator.address.go",
        "keyword.operator.channel.go",
      ],
      settings: {
        foreground: "var(--shiki-operator)",
      },
    },
    {
      scope: [
        "keyword.operator.comparison.go",
        "keyword.operator.logical.go",
      ],
      settings: {
        foreground: "var(--shiki-operator)",
      },
    },
    {
      scope: [
        "keyword.operator.assignment.go",
        "keyword.operator.arithmetic.go",
        "keyword.operator.arithmetic.bitwise.go",
      ],
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: "keyword.operator.ellipsis.go",
      settings: {
        foreground: "var(--shiki-operator)",
      },
    },
    {
      scope: "constant.other.placeholder.go",
      settings: {
        foreground: "var(--shiki-placeholder)",
      },
    },
    {
      scope: [
        "punctuation.definition.begin.bracket.curly.go",
        "punctuation.definition.end.bracket.curly.go",
        "punctuation.definition.begin.bracket.round.go",
        "punctuation.definition.end.bracket.round.go",
        "punctuation.definition.begin.bracket.square.go",
        "punctuation.definition.end.bracket.square.go",
        "punctuation.other.comma.go",
        "punctuation.other.period.go",
        "punctuation.other.colon.go",
        "punctuation.terminator.go",
      ],
      settings: {
        foreground: "var(--shiki-punctuation)",
      },
    },

    // SQL-specific scopes
    {
      scope: [
        "keyword.other.sql",
        "keyword.other.create.sql",
        "keyword.other.DML.sql",
        "keyword.other.DML.II.sql",
        "keyword.other.DDL.create.II.sql",
        "keyword.other.LUW.sql",
        "keyword.other.authorization.sql",
        "keyword.other.data-integrity.sql",
        "keyword.other.alias.sql",
        "keyword.other.order.sql",
        "keyword.other.object-comments.sql",
      ],
      settings: {
        foreground: "var(--shiki-keyword)",
      },
    },
    {
      scope: [
        "support.function.aggregate.sql",
        "support.function.analytic.sql",
        "support.function.bitmanipulation.sql",
        "support.function.conversion.sql",
        "support.function.datetime.sql",
        "support.function.mathematical.sql",
        "support.function.string.sql",
        "support.function.system.sql",
        "support.function.metadata.sql",
        "support.function.ranking.sql",
        "support.function.rowset.sql",
        "support.function.security.sql",
        "support.function.json.sql",
        "support.function.logical.sql",
        "support.function.collation.sql",
        "support.function.cryptographic.sql",
        "support.function.cursor.sql",
        "support.function.datatype.sql",
        "support.function.expression.sql",
        "support.function.globalvar.sql",
        "support.function.textimage.sql",
        "support.function.vector.sql",
      ],
      settings: {
        foreground: "var(--shiki-builtin)",
      },
    },
    {
      scope: "entity.name.function.sql",
      settings: {
        foreground: "var(--shiki-function)",
      },
    },
    {
      scope: [
        "storage.type.sql",
        "storage.modifier.sql",
      ],
      settings: {
        foreground: "var(--shiki-type)",
      },
    },
    {
      scope: [
        "constant.other.database-name.sql",
        "constant.other.table-name.sql",
      ],
      settings: {
        foreground: "var(--shiki-property)",
      },
    },
    {
      scope: "text.variable",
      settings: {
        foreground: "var(--shiki-parameter)",
      },
    },
    {
      scope: [
        "keyword.operator.star.sql",
        "keyword.operator.comparison.sql",
        "keyword.operator.concatenator.sql",
      ],
      settings: {
        foreground: "var(--shiki-operator)",
      },
    },
    {
      scope: "keyword.operator.math.sql",
      settings: {
        foreground: "var(--shiki-text)",
      },
    },
    {
      scope: [
        "string.quoted.single.sql",
        "string.quoted.double.sql",
      ],
      settings: {
        foreground: "var(--shiki-string)",
      },
    },
    {
      scope: "string.quoted.other.backtick.sql",
      settings: {
        foreground: "var(--shiki-property)",
      },
    },
    {
      scope: "constant.numeric.sql",
      settings: {
        foreground: "var(--shiki-number)",
      },
    },
    {
      scope: [
        "comment.line.double-dash.sql",
        "comment.block.sql",
      ],
      settings: {
        foreground: "var(--shiki-comment)",
      },
    },
    {
      scope: [
        "punctuation.section.scope.begin.sql",
        "punctuation.section.scope.end.sql",
        "punctuation.definition.string.begin.sql",
        "punctuation.definition.string.end.sql",
      ],
      settings: {
        foreground: "var(--shiki-punctuation)",
      },
    },
  ],
  type: "dark",
} satisfies ThemeRegistrationRaw;
