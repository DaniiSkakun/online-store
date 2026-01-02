const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const {User, Basket, PasswordReset} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            let {email, password, role} = req.body // role теперь может быть undefined
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или password'))
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }

            // Если роль не указана, устанавливаем USER по умолчанию
            // Разрешаем создание ADMIN только для начального наполнения базы данных
            if (!role) {
                role = 'USER';
            }
            // Разрешаем роли USER, SELLER, ADMIN

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, role, password: hashPassword}) // Используем обновленную role
            await Basket.create({userId: user.id})
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({token})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'))
            }
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({token})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async requestPasswordReset(req, res, next) {
        try {
            const {email} = req.body;
            if (!email) {
                return next(ApiError.badRequest('Вкажіть email'));
            }

            const user = await User.findOne({where: {email}});
            if (!user) {
                return next(ApiError.badRequest('Користувач з таким email не знайдений'));
            }

            const smtpHost = process.env.SMTP_HOST || process.env.MAIL_HOST || process.env.EMAIL_HOST;
            const smtpPort = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || process.env.EMAIL_PORT || 587);
            const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER || process.env.EMAIL_USER;
            const smtpPass = process.env.SMTP_PASSWORD
                || process.env.SMTP_PASS
                || process.env.MAIL_PASSWORD
                || process.env.MAIL_PASS
                || process.env.EMAIL_PASSWORD
                || process.env.EMAIL_PASS;
            const smtpFrom = process.env.SMTP_FROM || process.env.MAIL_FROM || process.env.EMAIL_FROM || smtpUser;

            let transporter;
            if (!smtpHost || !smtpUser || !smtpPass) {
                try {
                    const testAccount = await nodemailer.createTestAccount();
                    transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        secure: false,
                        auth: {user: testAccount.user, pass: testAccount.pass}
                    });
                } catch (err) {
                    return next(ApiError.badRequest('SMTP тимчасово недоступний. Зверніться до адміністратора.'));
                }
            } else {
                transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpPort === 465,
                    auth: {user: smtpUser, pass: smtpPass}
                });
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await PasswordReset.destroy({where: {email}});
            await PasswordReset.create({email, resetCode: code, expiresAt, used: false});

            const subject = 'Код відновлення пароля';
            const text = `Ваш код відновлення: ${code}\nКод дійсний 15 хвилин. Якщо ви не запитували скидання пароля, проігноруйте цей лист.`;
            const html = `
<!doctype html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f7;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f5f7;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width:420px;max-width:90%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);border:1px solid #e8e8ee;">
          <tr>
            <td style="padding:20px 24px 12px 24px;border-bottom:1px solid #f0f0f3;">
              <div style="font-size:18px;font-weight:700;color:#1a1a1a;">Відновлення пароля</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 8px 24px;color:#2f343a;font-size:15px;line-height:1.6;">
              Привіт! Ось ваш код для відновлення пароля:
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 24px 4px 24px;">
              <div style="display:inline-block;background:#f2f4f7;border:1px solid #dfe3ea;border-radius:10px;padding:14px 24px;font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:2px;">
                ${code}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 16px 24px;color:#5f6470;font-size:13px;line-height:1.5;">
              Код дійсний 15 хвилин. Якщо ви не запитували скидання пароля — проігноруйте цей лист.
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px 24px;color:#9aa0ad;font-size:12px;line-height:1.4;">
              Лист згенеровано автоматично, відповідати на нього не потрібно.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

            await transporter.sendMail({
                from: smtpFrom,
                to: email,
                subject,
                text,
                html
            });

            return res.json({message: 'Код відправлено на email реєстрації'});
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async verifyResetCode(req, res, next) {
        try {
            const {email, code} = req.body;
            if (!email || !code) {
                return next(ApiError.badRequest('Email та код обовʼязкові'));
            }

            const record = await PasswordReset.findOne({
                where: {email, resetCode: code, used: false},
                order: [['createdAt', 'DESC']]
            });

            if (!record) {
                return next(ApiError.badRequest('Невірний код відновлення'));
            }

            if (new Date(record.expiresAt) < new Date()) {
                return next(ApiError.badRequest('Код прострочений'));
            }

            return res.json({message: 'Код підтверджено'});
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async resetPassword(req, res, next) {
        try {
            const {email, code, newPassword} = req.body;
            if (!email || !code || !newPassword) {
                return next(ApiError.badRequest('Email, код і новий пароль обовʼязкові'));
            }
            if (newPassword.length < 6) {
                return next(ApiError.badRequest('Пароль має містити не менше 6 символів'));
            }

            const record = await PasswordReset.findOne({
                where: {email, resetCode: code, used: false},
                order: [['createdAt', 'DESC']]
            });

            if (!record) {
                return next(ApiError.badRequest('Невірний код відновлення'));
            }
            if (new Date(record.expiresAt) < new Date()) {
                return next(ApiError.badRequest('Код прострочений'));
            }

            const user = await User.findOne({where: {email}});
            if (!user) {
                return next(ApiError.badRequest('Користувач не знайдений'));
            }

            const hashPassword = await bcrypt.hash(newPassword, 5);
            await User.update({password: hashPassword}, {where: {id: user.id}});

            await PasswordReset.update({used: true}, {where: {email, resetCode: code}});

            return res.json({message: 'Пароль успішно змінено'});
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async changePassword(req, res, next) {
        const {currentPassword, newPassword} = req.body
        const userId = req.user.id

        if (!currentPassword || !newPassword) {
            return next(ApiError.badRequest('Необходимо указать текущий и новый пароль'))
        }

        const user = await User.findOne({where: {id: userId}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }

        const isValidPassword = bcrypt.compareSync(currentPassword, user.password)
        if (!isValidPassword) {
            return next(ApiError.badRequest('Неверный текущий пароль'))
        }

        const hashPassword = await bcrypt.hash(newPassword, 5)
        await User.update({password: hashPassword}, {where: {id: userId}})

        return res.json({message: 'Пароль успешно изменен'})
    }

    async deleteAccount(req, res, next) {
        const {password} = req.body
        const userId = req.user.id

        if (!password) {
            return next(ApiError.badRequest('Необходимо указать пароль'))
        }

        const user = await User.findOne({where: {id: userId}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }

        const isValidPassword = bcrypt.compareSync(password, user.password)
        if (!isValidPassword) {
            return next(ApiError.badRequest('Неверный пароль'))
        }

        // Удаляем пользователя и связанные данные
        await Basket.destroy({where: {userId}})
        await User.destroy({where: {id: userId}})

        return res.json({message: 'Аккаунт успешно удален'})
    }
}

module.exports = new UserController()