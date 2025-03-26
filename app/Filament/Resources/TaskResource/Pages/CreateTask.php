<?php

namespace App\Filament\Resources\TaskResource\Pages;

use App\Filament\Resources\TaskResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Storage;

class CreateTask extends CreateRecord
{
    protected static string $resource = TaskResource::class;

    protected function afterCreate(): void
    {
        $task = $this->record;
        $attachments = $this->form->getState()['attachments'] ?? [];

        foreach ($attachments as $filePath) {
            $fullPath = Storage::disk('local')->path($filePath); 

            $task->attachments()->create([
                'file_path' => $filePath,
                'original_name' => basename($filePath),
                'mime_type' => mime_content_type($fullPath), 
                'size' => filesize($fullPath), 
            ]);
        }
    }
}