import { useId, useState, type FormEvent } from 'react';
import { cx } from '../../utils/cx';
import { isEmail } from '../../utils/validadores';
import './Newsletter.css';
import { useTextos } from '../../i18n/contexto';

export interface NewsletterProps {
  /** Recebe o e-mail já conferido. Pode devolver uma Promise (o botão espera). */
  aoInscrever: (email: string) => void | Promise<void>;
  /** Com `aparencia="cartao"`: título do cartão. */
  titulo?: string;
  descricao?: string;
  placeholder?: string;
  rotuloBotao?: string;
  /** Mensagem depois de inscrever. */
  mensagemSucesso?: string;
  /** `cartao` = bloco marinho com título (coluna lateral) · `linha` = campo e botão numa pílula (rodapé). */
  aparencia?: 'cartao' | 'linha';
  className?: string;
}

/** Inscrição por e-mail (newsletter), para fundo marinho: rodapé ou coluna lateral. */
export function Newsletter({
  aoInscrever,
  titulo: tituloProp,
  descricao,
  placeholder: placeholderProp,
  rotuloBotao: rotuloBotaoProp,
  mensagemSucesso: mensagemSucessoProp,
  aparencia = 'cartao',
  className,
}: NewsletterProps) {
  const t = useTextos();
  const titulo = tituloProp ?? t.site.newsletterTitulo;
  const placeholder = placeholderProp ?? t.site.newsletterCampo;
  const rotuloBotao = rotuloBotaoProp ?? t.site.newsletterBotao;
  const mensagemSucesso = mensagemSucessoProp ?? t.site.newsletterOk;
  const id = useId();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feito, setFeito] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const valor = email.trim();
    if (!isEmail(valor)) {
      setErro(t.site.newsletterInvalido);
      return;
    }
    setErro('');
    setEnviando(true);
    try {
      await aoInscrever(valor);
      setFeito(true);
      setEmail('');
    } catch {
      setErro(t.site.newsletterErro);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className={cx('lp-news', `lp-news--${aparencia}`, className)} onSubmit={enviar} noValidate aria-label={titulo}>
      {aparencia === 'cartao' && <h3 className="lp-news-titulo">{titulo}</h3>}
      {descricao && <p className="lp-news-desc">{descricao}</p>}
      <div className="lp-news-campo">
        <label className="lp-sr" htmlFor={id}>
          E-mail
        </label>
        <input
          id={id}
          className="lp-news-input"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          placeholder={placeholder}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro || feito ? `${id}-msg` : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (feito) setFeito(false);
          }}
        />
        <button type="submit" className="lp-news-botao" disabled={enviando}>
          {rotuloBotao}
        </button>
      </div>
      {(erro || feito) && (
        <p id={`${id}-msg`} className={cx('lp-news-msg', erro && 'is-erro')} role={erro ? 'alert' : 'status'}>
          {erro || mensagemSucesso}
        </p>
      )}
    </form>
  );
}
