
const modPath = `src/modules/{{lowerModName}}`
/**
 * 
 * @param {import('plop').NodePlopAPI} plop 
 */
module.exports = function (plop) {
  plop.setGenerator('Create new module', {
    prompts: [
      {
        type: 'input',
        name: 'lowerModName',
        message: 'Module name in lowercase, e.g "user"'
      },
      {
        type: 'input',
        name: 'pascalModName',
        message: 'Module name in uppercase at the beginning, e.g "User"'
      }
    ],
    actions: [
      // just a sample action
      {
        type: 'add',
        path: `${modPath}/{{lowerModName}}.controller.ts`,
        templateFile: 'templates/controller.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/{{lowerModName}}.service.ts`,
        templateFile: 'templates/service.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/{{lowerModName}}.module.ts`,
        templateFile: 'templates/module.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/common/constants/index.constant.ts`,
        templateFile: 'templates/common/constants/index.constant.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/common/dtos/create-{{lowerModName}}.dto.ts`,
        templateFile: 'templates/common/dtos/index.dto.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/common/interfaces/index.type.ts`,
        templateFile: 'templates/common/interfaces/index.type.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/models/entities/{{lowerModName}}.entity.ts`,
        templateFile: 'templates/models/entities/entity.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/models/mappers/{{lowerModName}}.mapper.ts`,
        templateFile: 'templates/models/mappers/mapper.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/providers/cache/index.provider.ts`,
        templateFile: 'templates/providers/cache/index.provider.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/providers/jobs/index.provider.ts`,
        templateFile: 'templates/providers/jobs/index.provider.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/providers/queue/index.provider.ts`,
        templateFile: 'templates/providers/queue/index.provider.hbs'
      },
      {
        type: 'add',
        path: `${modPath}/providers/provider.module.ts`,
        templateFile: 'templates/providers/provider.module.hbs'
      },
    ],
    description: 'Create a new module with a basic structure'
  })
}