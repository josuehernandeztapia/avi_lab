import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioRecorderService } from '../services/audio-recorder.service';
import { VoiceApiService } from '../services/voice-api.service';
import { VoiceEvaluateRes } from '../core/avi-api-contracts';

@Component({
  standalone: true,
  selector: 'app-runner',
  imports: [CommonModule],
  template: `
  <div class="card">
    <h2>Runner</h2>
    <p class="muted">Graba un snippet y evalúalo</p>

    <div class="row" style="margin: 8px 0 16px 0">
      <button class="btn btn-primary" (click)="start()" [disabled]="recording()">Grabar</button>
      <button class="btn btn-ghost" (click)="stop()" [disabled]="!recording()">Detener</button>
      <button class="btn btn-ghost" (click)="evaluate()" [disabled]="!blob()">Evaluar</button>
    </div>

    <div *ngIf="res()" class="row">
      <div class="col">
        <div class="score">Score: {{ res()!.voiceScore | number:'1.2-2' }}</div>
        <div>Decision: <span class="pill">{{ res()!.decision }}</span></div>
        <div class="muted">Flags: {{ res()!.flags.join(', ') || '—' }}</div>
      </div>
      <div class="col">
        <div class="muted">latencyIndex: {{ res()!.latencyIndex | number:'1.2-2' }}</div>
        <div class="muted">pitchVar: {{ res()!.pitchVar | number:'1.2-2' }}</div>
        <div class="muted">energyStability: {{ res()!.energyStability | number:'1.2-2' }}</div>
      </div>
    </div>

    <div *ngIf="error()" style="color: var(--danger); margin-top: 12px;">{{ error() }}</div>
  </div>
  `
})
export class RunnerComponent {
  private rec = inject(AudioRecorderService);
  private api = inject(VoiceApiService);

  recording = signal(false);
  blob = signal<Blob | null>(null);
  res = signal<VoiceEvaluateRes | null>(null);
  error = signal<string | null>(null);

  async start() {
    this.error.set(null);
    this.res.set(null);
    this.blob.set(null);
    try {
      await this.rec.start();
      this.recording.set(true);
    } catch (e: any) {
      this.error.set('No se pudo iniciar la grabación');
    }
  }

  async stop() {
    const b = await this.rec.stop();
    this.recording.set(false);
    this.blob.set(b);
  }

  async evaluate() {
    if (!this.blob()) return;
    this.error.set(null);
    this.res.set(null);
    this.api.evaluateAudio(this.blob()!, 'Q1').subscribe({
      next: r => this.res.set(r),
      error: err => this.error.set('Error al evaluar (usa Mock ON para simular)')
    });
  }
}

