import { useCallback, useEffect, useMemo, useState } from 'react';
import * as settingsApi from '../api/settingsApi';
import {
  adaptBackupFromBackend,
  adaptSettingsFromBackend,
  adaptSettingsToBackend,
  adaptSystemStatusFromBackend,
} from '../adapters/settingsAdapter';

export default function useSettings() {
  const [settings, setSettings] = useState(null);
  const [draftSettings, setDraftSettings] = useState(null);
  const [activeSection, setActiveSection] = useState('business');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [backups, setBackups] = useState([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      settingsApi.getSettings(),
      settingsApi.getSystemStatus(),
      settingsApi.getBackupHistory(),
    ]).then(([settingsDto, statusDto, backupDtos]) => {
      if (!active) return;
      const adaptedSettings = adaptSettingsFromBackend(settingsDto);
      setSettings(adaptedSettings);
      setDraftSettings(adaptedSettings);
      setSystemStatus(adaptSystemStatusFromBackend(statusDto));
      setBackups(backupDtos.map(adaptBackupFromBackend));
    }).catch((requestError) => {
      if (active) setError(requestError.message || 'No fue posible cargar la configuración.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const hasUnsavedChanges = useMemo(
    () => Boolean(settings && draftSettings && JSON.stringify(settings) !== JSON.stringify(draftSettings)),
    [draftSettings, settings],
  );

  const updateSectionField = useCallback((section, field, value) => {
    setDraftSettings((current) => {
      if (!current?.[section]) return current;
      return { ...current, [section]: { ...current[section], [field]: value } };
    });
    setError('');
    setNotice('');
  }, []);

  const saveAllSettings = useCallback(async () => {
    if (!draftSettings) return false;
    setIsSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await settingsApi.updateSettings(adaptSettingsToBackend(draftSettings));
      const saved = adaptSettingsFromBackend(response);
      setSettings(saved);
      setDraftSettings(saved);
      setNotice('La configuración se guardó correctamente.');
      return true;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible guardar la configuración.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [draftSettings]);

  const discardChanges = useCallback(() => {
    setDraftSettings(settings);
    setError('');
    setNotice('');
  }, [settings]);

  const createManualBackup = useCallback(async () => {
    if (!settings) return null;
    setIsCreatingBackup(true);
    setError('');
    setNotice('');
    try {
      const response = await settingsApi.createManualBackup(adaptSettingsToBackend(settings));
      const backup = adaptBackupFromBackend(response);
      setBackups((current) => [backup, ...current]);

      if (typeof document !== 'undefined') {
        const content = JSON.stringify(adaptSettingsToBackend(settings), null, 2);
        const file = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${backup.id}.json`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      setNotice(`Respaldo ${backup.id} creado y descargado.`);
      return backup;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible crear el respaldo.');
      throw requestError;
    } finally {
      setIsCreatingBackup(false);
    }
  }, [settings]);

  const dismissMessages = useCallback(() => {
    setError('');
    setNotice('');
  }, []);

  return {
    settings,
    draftSettings,
    activeSection,
    setActiveSection,
    hasUnsavedChanges,
    isLoading,
    isSaving,
    error,
    notice,
    systemStatus,
    backups,
    isCreatingBackup,
    updateSectionField,
    saveAllSettings,
    discardChanges,
    createManualBackup,
    dismissMessages,
  };
}
