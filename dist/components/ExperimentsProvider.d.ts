import React from 'react';
import type { Experiment } from '../types';
interface ExperimentsProviderProps {
    experiments: Experiment[];
    showAdminPanel?: boolean;
    children: React.ReactNode;
}
export declare const ExperimentsContext: React.Context<ExperimentsContextType>;
export declare const ExperimentsProvider: React.FC<ExperimentsProviderProps>;
export {};
