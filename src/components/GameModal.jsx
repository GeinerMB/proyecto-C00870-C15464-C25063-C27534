/** 
 * Componente para mostrar un modal de juego.
 * @param {string} id - El ID del modal.
 * @param {string} title - El título del modal.
 * @param {string} description - La descripción del modal.
 * @param {React.ReactNode} children - Los hijos del modal.
 * @param {React.ReactNode} actions - Las acciones del modal.
 * @returns {JSX.Element} El elemento JSX del modal de juego.
 */

export default function GameModal({
  id,
  title,
  description,
  children,
  actions,
}) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <dialog id={id} className="game-modal" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <div className="game-modal__window">
        <header className="game-modal__header">
          <h2 id={titleId}>{title}</h2>
        </header>

        <div className="game-modal__body">
          {children}

          {description && (
            <p id={descriptionId}>{description}</p>
          )}

          {actions && (
            <footer className="game-modal__actions">
              {actions}
            </footer>
          )}
        </div>
      </div>
    </dialog>
  );
}
