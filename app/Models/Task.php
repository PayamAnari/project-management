<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'user_id',
        'priority',
        'status',
        'due_date',
    ];

    

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }
}