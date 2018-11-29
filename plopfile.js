module.exports = function(plop) {
  // Component Generator
  plop.setGenerator("component", {
    description: "Component",
    prompts: [
      {
        type: "input",
        name: "componentName",
        message: "Component Name?"
      },
      {
        type: "list",
        name: "componentType",
        choices: [{
          name: "Functional Component",
          value: true,
        },
        {
          name: "Class Component",
          value: false
        }],
        message: "Is this a functional or class component?"
      }
    ],
    actions: data => {
      const actions = [
        {
          type: "add",
          path:
            "src/components/{{dashCase componentName}}/{{properCase componentName}}.css",
          templateFile: "plop-templates/component/styles.hbs"
        }
      ]
      if (data.componentType) {
        actions.push({
          type: "add",
          path:
            "src/components/{{dashCase componentName}}/{{properCase componentName}}.js",
          templateFile: "plop-templates/component/functionalComponent.hbs"
        })
      } else {
        actions.push({
            type: "add",
            path:
              "src/components/{{dashCase componentName}}/{{properCase componentName}}.js",
            templateFile: "plop-templates/component/classComponent.hbs"
          });
      }
      return actions;
    }
  });
};
