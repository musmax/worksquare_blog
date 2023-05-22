const logger = require('../config/logger');
const { db } = require('../models');
const { createMessageTemplate } = require('../services/message_template.service');
const { createUser } = require('../services/user.service');

const setAdminPermissions = async () => {
  const adminRole = await db.roles.findOne({ where: { name: 'admin' } });
  const adminPermissions = await db.permission.findAll();
  await adminRole.setPermissions(adminPermissions);
};

const setUserPermissions = async () => {
  const userRole = await db.roles.findOne({ where: { name: 'user' } });
  const permissionsValue = ['users.view', 'users.manage', 'questions.view', 'tests.view', 'sections.view'];
  const userPermissions = await db.permission.findAll({ where: { value: permissionsValue } });
  await userRole.setPermissions(userPermissions);
};

const createDummyRoles = async () => {
  // create roles
  const roles = [
    {
      name: 'user',
      description: 'all users',
    },
    {
      name: 'admin',
      description: 'system admin with access to all features',
    },
  ];

  //   get existing roles
  const allRoles = await db.roles.findAll();

  //   if role is empty bulk create roles
  if (allRoles.length === 0 || allRoles.length !== roles.length) {
    // filter for roles that do not exist
    const filteredRoles = roles.filter((role) => !allRoles.find((r) => r.dataValues.name === role.name));
    await db.roles.bulkCreate(filteredRoles);
    logger.info('roles created'.rainbow);
  }
};

const createDummyVariables = async () => {
  // create variables
  const variables = [
    {
      name: 'lastName',
    },
    {
      name: 'firstName',
    },
    {
      name: 'token',
    },
    {
      name: 'code',
    },
  ];

  //   get existing variables
  const allVariables = await db.variable.findAll();

  //   if variables is empty bulk create variables
  if (allVariables.length === 0 || allVariables.length !== variables.length) {
    // filter for variables that do not exist
    const filteredVariables = variables.filter((variable) => !allVariables.find((v) => v.dataValues.name === variable.name));
    await db.variable.bulkCreate(filteredVariables);
    logger.info('variables created'.rainbow);
  }
};

const createDummyMessageTemplates = async () => {
  const MessageTemplates = [
    {
      messageTemplate: {
        title: 'Welcome_Email',
        description: 'Welcome email to new users',
        emailSubject: 'Welcome to the platform',
        emailBody: 'Hello {{firstName}}, welcome to the platform',
        smsSubject: 'Welcome to the platform',
        smsBody: 'Hello {{firstName}}, welcome to the platform',
      },
      variables: [
        {
          name: 'firstName',
        },
      ],
    },
    {
      messageTemplate: {
        title: 'Reset_Password',
        description: 'Reset password message',
        emailSubject: 'Reset Password',
        emailBody:
          'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/reset-password?token={{token}} If you did not request any password resets, then ignore this email.',
        smsSubject: 'Reset Password',
        smsBody:
          'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/reset-password?token={{token}} If you did not request any password resets, then ignore this email.',
      },
      variables: [
        {
          name: 'firstName',
        },
        {
          name: 'token',
        },
      ],
    },
  ];

  //   get existing message templates
  const allMessageTemplates = await db.message_template.findAll();

  //   if message templates is empty bulk create message templates
  if (allMessageTemplates.length === 0 || allMessageTemplates.length !== MessageTemplates.length) {
    // filter for message templates that do not exist
    const filteredMessageTemplates = MessageTemplates.filter(
      (messageTemplate) => !allMessageTemplates.find((m) => m.dataValues.title === messageTemplate.messageTemplate.title)
    );
    filteredMessageTemplates.forEach(async (messageTemplate) => {
      await createMessageTemplate(messageTemplate);
    });
    logger.info('message templates created'.rainbow);
  }
};

const createDummyUsers = async () => {
  const users = [
    {
      firstName: 'admin 1',
      lastName: 'admin',
      phoneNumber: '12345678',
      email: 'admin1@example.com',
      password: 'password1',
      role: 'admin',
    },
    {
      firstName: 'admin 2',
      lastName: 'admin',
      phoneNumber: '12345678',
      email: 'admin2@example.com',
      password: 'password1',
      role: 'admin',
    },
    {
      firstName: 'user 1',
      lastName: 'user',
      phoneNumber: '12345678',
      email: 'user1@example.com',
      password: 'password1',
      role: 'user',
    },
    {
      firstName: 'user 2',
      lastName: 'user',
      phoneNumber: '12345678',
      email: 'user2@example.com',
      password: 'password1',
      role: 'user',
    },
  ];

  //   get existing users
  const allUsers = await db.user.findAll();

  //   if user is empty bulk create users
  if (allUsers.length === 0 || allUsers.length !== users.length) {
    // filter for users that do not exist
    const filteredUsers = users.filter((user) => !allUsers.find((l) => l.dataValues.email === user.email));
    filteredUsers.forEach(async (user) => {
      await createUser(user);
    });
    logger.info('users created'.rainbow);
  }
};

const createPermissions = async () => {
  const permissions = [
    {
      name: 'View Users',
      value: 'users.view',
      groupName: 'User Permissions',
      description: 'Permission to view other users account details',
    },
    {
      name: 'Manage Users',
      value: 'users.manage',
      groupName: 'User Permissions',
      description: 'Permission to create, delete and modify other users account details',
    },
    {
      name: 'View Permissions',
      value: 'permissions.view',
      groupName: 'Permission Permissions',
      description: 'Permission to view permissions',
    },
    {
      name: 'Manage Permissions',
      value: 'permissions.manage',
      groupName: 'Permission Permissions',
      description: 'Permission to create, delete and modify permissions',
    },
    {
      name: 'View Roles',
      value: 'roles.view',
      groupName: 'Role Permissions',
      description: 'Permission to view roles',
    },
    {
      name: 'Manage Roles',
      value: 'roles.manage',
      groupName: 'Role Permissions',
      description: 'Permission to create, delete and modify roles',
    },
    {
      name: 'View Message Templates',
      value: 'message_templates.view',
      groupName: 'Message Template Permissions',
      description: 'Permission to view message templates',
    },
    {
      name: 'Manage Message Templates',
      value: 'message_templates.manage',
      groupName: 'Message Template Permissions',
      description: 'Permission to create, delete and modify message templates',
    },
    {
      name: 'View Variables',
      value: 'variables.view',
      groupName: 'Variable Permissions',
      description: 'Permission to view variables',
    },
    {
      name: 'Manage Variables',
      value: 'variables.manage',
      groupName: 'Variable Permissions',
      description: 'Permission to create, delete and modify variables',
    },
    {
      name: 'View Questions',
      value: 'questions.view',
      groupName: 'Question Permissions',
      description: 'Permission to view questions',
    },
    {
      name: 'Manage Questions',
      value: 'questions.manage',
      groupName: 'Question Permissions',
      description: 'Permission to create, delete and modify questions',
    },
    {
      name: 'View Sections',
      value: 'sections.view',
      groupName: 'Section Permissions',
      description: 'Permission to view sections',
    },
    {
      name: 'Manage Sections',
      value: 'sections.manage',
      groupName: 'Section Permissions',
      description: 'Permission to create, delete and modify sections',
    },
    {
      name: 'View Tests',
      value: 'tests.view',
      groupName: 'Test Permissions',
      description: 'Permission to view tests',
    },
    {
      name: 'Manage Tests',
      value: 'tests.manage',
      groupName: 'Test Permissions',
      description: 'Permission to create, delete and modify tests',
    },
  ];

  //   get existing permissions
  const allPermissions = await db.permission.findAll();

  //   if permission is empty bulk create permissions
  if (allPermissions.length === 0 || allPermissions.length !== permissions.length) {
    // filter for permissions that do not exist
    const filteredPermissions = permissions.filter(
      (permission) => !allPermissions.find((l) => l.dataValues.value === permission.value)
    );
    filteredPermissions.forEach(async (permission) => {
      // TODO: add permission service
      await db.permission.create(permission);
    });
    logger.info('permissions created'.rainbow);
  }

  // set permissions for roles
  await setAdminPermissions();
  await setUserPermissions();
};

module.exports = {
  createDummyRoles,
  createDummyVariables,
  createDummyMessageTemplates,
  createDummyUsers,
  createPermissions,
};
