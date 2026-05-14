-- Adiciona campo de data agendada nas atividades
ALTER TABLE activities
  ADD COLUMN IF NOT EXISTS scheduled_date date NULL;

COMMENT ON COLUMN activities.scheduled_date IS
  'Data em que a atividade está agendada para ser executada (opcional)';
