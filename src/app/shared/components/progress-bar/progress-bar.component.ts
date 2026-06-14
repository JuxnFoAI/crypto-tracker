import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `<span class="block h-full rounded-full bg-accent transition-all"></span>`,
  host: {
    class: 'block h-full',
    '[style.width.%]': 'progress()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly progress = input.required<number>();
}
