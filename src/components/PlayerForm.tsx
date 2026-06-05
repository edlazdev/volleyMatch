import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import type { PlayerLevel } from '@/types';
import { LEVELS, LEVEL_SELECT_CLASS, levelCode } from '@/data/levels';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/i18n';

interface PlayerFormValues {
  name: string;
  level: PlayerLevel;
}

interface PlayerFormProps {
  /** Indica si ya se alcanzó el cupo máximo de jugadores. */
  disabled?: boolean;
  onSubmit: (name: string, level: PlayerLevel) => void;
}

export function PlayerForm({ disabled, onSubmit }: PlayerFormProps) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<PlayerFormValues>({
    defaultValues: { name: '', level: 3 },
  });

  const currentLevel = Number(watch('level')) as PlayerLevel;

  const submit = handleSubmit((values) => {
    onSubmit(values.name, Number(values.level) as PlayerLevel);
    reset({ name: '', level: values.level });
    setFocus('name');
  });

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('form.nameLabel')}
          </label>
          <Input
            placeholder={t('form.namePlaceholder')}
            autoComplete="off"
            invalid={!!errors.name}
            disabled={disabled}
            {...register('name', {
              required: t('form.required'),
              maxLength: { value: 40, message: t('form.maxLen') },
            })}
          />
        </div>

        <div className="sm:w-24">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('form.levelLabel')}
          </label>
          <Select
            disabled={disabled}
            accentClass={LEVEL_SELECT_CLASS[currentLevel]}
            className="font-semibold"
            {...register('level', { required: true })}
          >
            {LEVELS.map((lvl) => (
              <option
                key={lvl.value}
                value={lvl.value}
                title={t(`level.${lvl.value}`)}
              >
                {levelCode(lvl.value)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {errors.name && (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {errors.name.message}
        </p>
      )}

      <Button type="submit" disabled={disabled} fullWidth size="md">
        <UserPlus className="h-4 w-4" />
        {disabled ? t('form.full') : t('form.add')}
      </Button>
    </form>
  );
}
